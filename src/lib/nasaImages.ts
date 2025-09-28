// src/lib/nasaImages.ts
// Mejor imagen para una noticia: primero OG/Twitter del artículo, luego NASA Images API.
// Incluye cache en memoria y fallbacks CORS.

const memJson = new Map<string, any>();           // cache para JSON/texto
const memImg  = new Map<string, string | null>(); // cache para URLs de imagen

function absURL(maybe: string | null | undefined, base: string): string | undefined {
  if (!maybe) return undefined;
  try { return new URL(maybe, base).href; } catch { return undefined; }
}

async function fetchTextWithFallback(url: string): Promise<string> {
  try {
    const r = await fetch(url, { mode: "cors" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } catch {
    const prox = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const r2 = await fetch(prox);
    if (!r2.ok) throw new Error(`Proxy HTTP ${r2.status}`);
    return await r2.text();
  }
}

async function fetchJSONWithFallback<T = any>(url: string): Promise<T> {
  if (memJson.has(url)) return memJson.get(url);
  try {
    const r = await fetch(url, { mode: "cors" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = (await r.json()) as T;
    memJson.set(url, j);
    return j;
  } catch {
    const prox = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const r2  = await fetch(prox);
    if (!r2.ok) throw new Error(`Proxy HTTP ${r2.status}`);
    const j   = JSON.parse((await r2.json()).contents) as T;
    memJson.set(url, j);
    return j;
  }
}

// --- 1) OG/Twitter image del artículo ---
export async function getOgImageFromPage(articleUrl: string): Promise<string | undefined> {
  if (memImg.has(articleUrl)) return memImg.get(articleUrl) ?? undefined;
  try {
    const html = await fetchTextWithFallback(articleUrl);
    const doc  = new DOMParser().parseFromString(html, "text/html");

    const og  = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
    const tw  = doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content");
    const any = og || tw || doc.querySelector("article img, figure img, img")?.getAttribute("src");

    const resolved = absURL(any || undefined, articleUrl);
    memImg.set(articleUrl, resolved || null);
    return resolved || undefined;
  } catch {
    memImg.set(articleUrl, null);
    return undefined;
  }
}

// --- 2) NASA Images API por título ---
type YearRange = { start?: number; end?: number };

function sanitizeQuery(title: string) {
  return title.split(/[-–—:\|]/)[0].replace(/["“”]/g, "").trim();
}
function buildSearchURL(q: string, yr?: YearRange) {
  const p = new URLSearchParams({ q, media_type: "image", page: "1" });
  if (yr?.start) p.set("year_start", String(yr.start));
  if (yr?.end)   p.set("year_end",   String(yr.end));
  return `https://images-api.nasa.gov/search?${p.toString()}`;
}

export async function getImageForNews(title: string, yr?: YearRange): Promise<string | undefined> {
  const q = sanitizeQuery(title);
  if (!q) return undefined;
  if (memImg.has(q)) return memImg.get(q) ?? undefined;

  try {
    const data  = await fetchJSONWithFallback<any>(buildSearchURL(q, yr));
    const items = data?.collection?.items || [];
    if (!items.length) { memImg.set(q, null); return undefined; }

    const first  = items[0];
    const direct = first?.links?.find((l: any) => (l.render || "").toLowerCase() === "image")?.href
                || first?.links?.[0]?.href;

    if (direct) { memImg.set(q, direct); return direct; }

    const nasaId = first?.data?.[0]?.nasa_id;
    if (!nasaId) { memImg.set(q, null); return undefined; }

    const assets = await fetchJSONWithFallback<any>(`https://images-api.nasa.gov/asset/${nasaId}`);
    const href   = assets?.collection?.items?.[0]?.href;
    memImg.set(q, href || null);
    return href || undefined;
  } catch {
    memImg.set(q, null);
    return undefined;
  }
}

// --- 3) Mejor disponible: OG primero, luego Images API ---
export async function getBestImageForNews(title: string, articleUrl: string, yr?: YearRange) {
  return (await getOgImageFromPage(articleUrl)) || (await getImageForNews(title, yr));
}

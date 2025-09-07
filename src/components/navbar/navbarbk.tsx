import { useState, useEffect } from "react";

const LINKS = [
  { id: "home", name: "Home" },
  { id: "about", name: "About" },
  { id: "expertise", name: "Expertise" },
  { id: "projects", name: "Projects" },
  { id: "contact", name: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    setOpen(false);
  };

  // 👇 Detecta la sección visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.25, 0.5, 0.75] }
    );

    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center justify-between rounded-full border border-white/10
                        bg-purple-700/70 backdrop-blur px-3 py-2 text-white">
          <button onClick={() => go("home")} className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full
                            bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
              TR
            </div>
          </button>

          <div className="hidden gap-2 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`rounded-full px-4 py-2 text-sm transition
                  ${active === l.id
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                {l.name}
              </button>
            ))}
          </div>

          <button onClick={() => setOpen((s) => !s)} className="p-2 md:hidden" aria-label="menu">
            <svg width="24" height="24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>

        {open && (
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-2 md:hidden">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`w-full rounded-lg px-3 py-2 text-left transition
                  ${active === l.id ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                {l.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

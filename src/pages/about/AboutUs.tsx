// src/component/AboutUs.tsx
import { Handshake, Trophy, Rocket, Cpu, Database, Github, Linkedin, Mail, UsersRound, Globe } from "lucide-react";

type Social = { type: "github" | "linkedin" | "mail" | "web"; url: string };
type Member = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;      // /team/maggie.jpg en public, por ejemplo
  initials?: string;   // fallback si no hay foto
  socials?: Social[];
};

const TEAM: Member[] = [
  {
    name: "Maggie o Marian",
    role: "Product & Data",
    initials: "MM",
    socials: [
      { type: "github", url: "https://github.com/tu-usuario" },
      { type: "linkedin", url: "https://www.linkedin.com/in/tu-perfil" },
      { type: "mail", url: "mailto:tucorreo@dominio.com" },
    ],
  },
  {
    name: "Neo Dev",
    role: "Frontend Engineer",
    initials: "ND",
    socials: [{ type: "github", url: "https://github.com/otro" }],
  },
  {
    name: "Data Wiz",
    role: "Data & APIs",
    initials: "DW",
  },
];

function AvatarCircle({ member }: { member: Member }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
        loading="lazy"
      />
    );
  }
  const initials = member.initials ?? member.name.split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase();
  return (
    <div className="h-14 w-14 rounded-full grid place-items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold ring-2 ring-white/15">
      {initials}
    </div>
  );
}

function SocialIcon({ s }: { s: Social }) {
  const base = "text-white/80 hover:text-white transition";
  if (s.type === "github") return <a href={s.url} target="_blank" rel="noreferrer" className={base} aria-label="GitHub"><Github size={18} /></a>;
  if (s.type === "linkedin") return <a href={s.url} target="_blank" rel="noreferrer" className={base} aria-label="LinkedIn"><Linkedin size={18} /></a>;
  if (s.type === "mail") return <a href={s.url} className={base} aria-label="Email"><Mail size={18} /></a>;
  return <a href={s.url} target="_blank" rel="noreferrer" className={base} aria-label="Website"><Globe size={18} /></a>;
}

export default function AboutUs() {
  return (
    <section id="aboutus" className="relative py-24 md:py-32 text-white">
      {/* contenedor centrado mismo ancho que navbar (ajusta max-w a tu gusto) */}
      <div className="mx-auto w-[min(68rem,92vw)]">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
              <Handshake className="h-4 w-4" />
              <span className="text-xs tracking-wide">About Us</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              NeoScience — Ciencia clara, datos reales.
            </h2>
            <p className="mt-3 max-w-2xl text-white/80">
              Exploramos el espacio con datos abiertos de la NASA y lo bajamos a tierra con visualizaciones,
              simulaciones y aprendizaje corto. Sin humo.
            </p>
          </div>
          <div className="hidden md:block rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Trophy className="h-4 w-4" />
              <span>Hackatón NASA</span>
            </div>
          </div>
        </div>

        {/* Reto + Fuentes + Stack */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              <h3 className="font-semibold">El reto</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Construir una app que permita <b>explorar NEOs</b>, <b>visualizar eventos solares</b> y
              <b> aprender ciencia</b> con contenido breve e interactivo. Todo con datos reales y en tiempo casi real.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Fuentes de datos</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• NEO WS (Near Earth Objects)</li>
              <li>• DONKI (Space Weather)</li>
              <li>• APOD (Astronomy Picture of the Day)</li>
              <li>• Images & Video Library</li>
              <li>• EPIC / ISS (opcional)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <h3 className="font-semibold">Stack</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• React + Vite + TypeScript</li>
              <li>• TailwindCSS + Framer Motion</li>
              <li>• Recharts/Chart.js para gráficos</li>
              <li>• OGL/WebGL para fondos/simulaciones</li>
              <li>• Fetch + SWR/React Query (opcional)</li>
            </ul>
          </div>
        </div>

        {/* Equipo */}
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <UsersRound className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Team</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-4">
                  <AvatarCircle member={m} />
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-white/70">{m.role}</div>
                    {m.bio && <div className="mt-1 text-xs text-white/60">{m.bio}</div>}
                    {m.socials && (
                      <div className="mt-2 flex items-center gap-3">
                        {m.socials.map((s) => (
                          <SocialIcon key={s.url} s={s} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/15 to-purple-600/15 p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h4 className="text-lg font-semibold">¿Comentarios o ideas?</h4>
              <p className="text-white/80 text-sm">
                Escríbenos y cuéntanos qué te gustaría explorar. La ciencia se construye en equipo.
              </p>
            </div>
            <a
              href="mailto:tucorreo@dominio.com"
              className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur hover:bg-white/25 transition"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

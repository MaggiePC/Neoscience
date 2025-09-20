import s from "./Footer.module.css";
import {
  SiFacebook,
  SiX,
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";

const BRANDS = [
  { key: "facebook",  Icon: SiFacebook,  href: "#", bg: "#1877F2", label: "Facebook" },
  { key: "x",         Icon: SiX,         href: "#", bg: "#000000", label: "X (Twitter)" },
  { key: "instagram", Icon: SiInstagram, href: "#", bg: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)", label: "Instagram" },
 
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Texto + íconos en la misma línea */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
        <span className={s.inlineIcons}>
             Share your experience on social media!    
          </span>

          <div className="flex items-center gap-3">
          <span className={s.inlineIcons}>
            {BRANDS.map(({ key, Icon, href, bg, label }) => (
              <a
                key={key}
                href={href}
                aria-label={label}
                title={label}
                className="relative inline-grid place-items-center w-11 h-11 rounded-full overflow-hidden
                           ring-1 ring-white/15 shadow-[0_8px_20px_rgba(0,0,0,.35)]
                           transition-transform duration-150 hover:scale-110"
                style={{ background: bg }}
              >
                {/* brillo sutil arriba */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-full opacity-40"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 30% 25%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />
                <Icon className="relative text-white text-[18px]" />
              </a>
            ))}</span>
          </div>
        </div>

        {/* Nota final */}
        <div className="text-sm italic text-gray-400 text-center md:text-right">
          © 2025 Neoscience — Educational use only
        </div>
      </div>
    </footer>
  );
}



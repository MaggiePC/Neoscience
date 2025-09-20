// Footer.jsx — versión final sin Facebook
import s from "./Footer.module.css";
import { SiX, SiLinkedin } from "react-icons/si";

// ==== PERSONALIZA ESTO ====
const APP_URL   = " "; // tu landing/app
const MESSAGE   = "I just learned how to protect our planet with Earth Defender! 🌍🚀 @Neoscience #EarthDefender #SpaceApps #NASAChallenge";
// ==========================

const APP_URL_ENC = encodeURIComponent(APP_URL);
const MESSAGE_ENC = encodeURIComponent(MESSAGE);

// Enlaces oficiales
const SHARE = {
  x:        `https://twitter.com/intent/tweet?url=${APP_URL_ENC}&text=${MESSAGE_ENC}`,  // X: texto + URL
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${APP_URL_ENC}&text=${MESSAGE_ENC}`,       // LinkedIn: solo URL
};

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          <span className={s.inlineIcons}>Share your experience on social media!</span>

          <div className="flex items-center gap-5">
           <span className={s.inlineIcons}>
            {/* X (Twitter) */}
            <a
              href={SHARE.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-grid place-items-center w-11 h-11 rounded-full"
              style={{ background: "#000" }}
              title="Share with X"
              aria-label="Share with X"
            >
              <SiX className="text-white text-[18px]" />
            </a>

            {/* LinkedIn */}
            <a
              href={SHARE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-grid place-items-center w-11 h-11 rounded-full"
              style={{ background: "#0A66C2" }}
              title="Share with LinkedIn"
              aria-label="Share with LinkedIn"
            >
              <SiLinkedin className="text-white text-[18px]" />
            </a>
            </span>
          </div>
        </div>

        <div className="text-sm italic text-gray-400 text-center md:text-right">
          © 2025 Neoscience — Educational use only
        </div>
      </div>
    </footer>
  );
}

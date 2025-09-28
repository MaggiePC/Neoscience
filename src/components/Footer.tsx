// src/components/Footer.jsx
import s from "./Footer.module.css";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { RiFacebookFill, RiInstagramFill, RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";

import { useTranslation } from "react-i18next";


const solid =
  "p-3 rounded-full bg-white/5 text-white/80 hover:text-white " +
  "hover:shadow-[0_0_18px_rgba(107,127,215,0.8)] hover:bg-[#FFE87C]/20 " +
  "transition-all duration-300";


export default function Footer() {
  const { t } = useTranslation();

  // ==========================
const APP_URL   = " "; // tu landing/app
const MESSAGE   = t("footer.msgShare");
const APP_URL_ENC = encodeURIComponent(APP_URL);
const MESSAGE_ENC = encodeURIComponent(MESSAGE);

// Enlaces oficiales
const SHARE = {
  x:        `https://twitter.com/intent/tweet?url=${APP_URL_ENC}&text=${MESSAGE_ENC}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${APP_URL_ENC}&text=${MESSAGE_ENC}`
};
  return (
    <footer className={s.footer}>
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          <span className={s.inlineIcons}>{t("footer.share")}</span>

          <div className="flex items-center gap-5">
            <span className={s.inlineIcons}>
              <div className="flex items-center gap-3">
                <span className={s.inlineIcons}>
                
      <a className={`${solid} bg-[rgba(24,119,242,0.9)] hover:bg-[rgba(24,119,242,1)]`} href="https://facebook.com/..." target="_blank" rel="noreferrer">
        <Facebook className="w-5 h-5" strokeWidth={2.2} />
      </a></span><span className={s.inlineIcons}>
      <a className={`${solid} bg-[rgba(29,161,242,0.9)] hover:bg-[rgba(29,161,242,1)]`} href="https://x.com/..." target="_blank" rel="noreferrer">
        <Twitter className="w-5 h-5" strokeWidth={2.2} />
      </a></span><span className={s.inlineIcons}>
      <a className={`${solid} bg-[rgba(228,64,95,0.9)] hover:bg-[rgba(228,64,95,1)]`} href="https://instagram.com/..." target="_blank" rel="noreferrer">
        <Instagram className="w-5 h-5" strokeWidth={2.2} />
      </a></span><span className={s.inlineIcons}>
      <a className={`${solid} bg-[rgba(0,119,181,0.9)] hover:bg-[rgba(0,119,181,1)]`} href="https://linkedin.com/..." target="_blank" rel="noreferrer">
        <Linkedin className="w-5 h-5" strokeWidth={2.2} />
      </a></span>
    </div>
            </span>
          </div>
        </div>

        <div className="text-sm italic text-gray-400 text-center md:text-right">
          {t("footer.terms")}
        </div>
      </div>
    </footer>
  );
}

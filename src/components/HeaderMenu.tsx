// src/components/Header.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import s from "./HeaderMenu.module.css";

/** Iconos inline (sin dependencias) */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

type SubItem = { key: string; label: string; to: string; icon?: string };
interface MenuItem { key: string; label: string; to: string; subitems?: SubItem[] }

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // idioma persistido
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleLang = () => {
    const next = i18n.language.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  // scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const shrink = scrollY > 50;
  const headerTransform = Math.min(scrollY * 0.3, 100);

  // cerrar con click fuera / Esc
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // hover-capable (desktop)
  const isHoverCapable =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const openDropdown = (key: string) => setActiveDropdown(key);
  const closeDropdown = () => setActiveDropdown(null);
  const toggleDropdown = (key: string) =>
    setActiveDropdown(prev => (prev === key ? null : key));

  // Menú traducido
  const MENU: MenuItem[] = useMemo(() => [
    { key: "home",            label: t("menu.home"),        to: "/" },
    { key: "aboutProyect",     label: t("menu.aboutProyect"),   to: "",
      subitems: [
        { key: "story-telling",    label: t("menu.story-telling"),        to: "/story-telling" },
        { key: "aboutTeam",             label: t("menu.aboutTeam"),         to: "/aboutTeam" },
       ],
      },  

   
    { key: "learn",     label: t("menu.learn"),   to: "", 
      subitems: [
       { key: "game",             label: t("menu.game"),         to: "/game" },
        { key: "quiz",             label: t("menu.quiz"),         to: "/quiz" },
       ],
      },  
    { key: "simulation",       label: t("menu.simulation"),   to: "",
      subitems: [
        { key: "impact-zone",      label: t("menu.impact-zone"),       to: "/impact-zone",}, 
         { key: "mitigation",      label: t("menu.mitigation"),       to: "/impact-mitigation",}, 
       ],
      }, 
   
    { key: "exploreData",     label: t("menu.exploreData"),   to: "", 
      subitems: [
         { key: "machine-learning", label: t("menu.machine-learning"),           to: "/machine-learning" , icon: "📚"},
        { key: "newsOfWeek",     label: t("menu.newsOfWeek"),   to: "/newsOfWeek"},
        { key: "dailyImage", label: t("menu.dailyImage"), to: "/dailyImage" },
         { key: "aiAssistant", label: t("menu.aiAssistant"), to: "/aiAssistant" },
         
      ],

    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [i18n.language, t]);

  // marca activo al padre si alguna subruta coincide
  const isParentActive = (item: MenuItem) =>
    !!item.subitems?.some(s => location.pathname.startsWith(s.to)) ||
    location.pathname === item.to;

  return (
    <motion.header
      className={`${s.header} ${shrink ? s.shrink : ""}`}
      style={{ transform: `translateY(${headerTransform}px)` }}
      initial={prefersReducedMotion ? false : { y: -100 }}
      animate={prefersReducedMotion ? undefined : { y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={s.inner}>
        {/* Brand */}
        <div className={s.brand}>
          <div className={s.logo} aria-hidden="true"><span style={{ fontSize: 18 }}>🛡️</span></div>
          <h1 className={s.title}>
            <NavLink to="/" className={s.brandLink}>{t("brand")}</NavLink>
          </h1>
        </div>

        {/* Botón móvil */}
        <button
          className={s.burger}
          aria-label={mobileOpen ? (i18n.language.startsWith("es") ? "Cerrar menú" : "Close menu")
                                 : (i18n.language.startsWith("es") ? "Abrir menú"  : "Open menu")}
          aria-expanded={mobileOpen}
          aria-controls="main-nav"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <CloseIcon className={s.burgerIcon}/> : <MenuIcon className={s.burgerIcon}/> }
        </button>

        {/* Nav */}
        <nav
          id="main-nav"
          className={`${s.nav} ${mobileOpen ? s.navOpen : ""}`}
          role="navigation"
          aria-label="Main"
          ref={dropdownRef}
        >
          {MENU.map((item) => {
            const hasSub = !!item.subitems?.length;
            const isOpen = activeDropdown === item.key;

            const hoverProps = isHoverCapable && hasSub
              ? { onMouseEnter: () => openDropdown(item.key), onMouseLeave: () => closeDropdown() }
              : {};

            return (
              <div key={item.key} className={s.item} {...hoverProps}>
                {hasSub ? (
                  <>
                    <button
                      className={`${s.btn} ${isParentActive(item) ? s.btnActive : ""}`}
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      aria-controls={`${item.key}-menu`}
                      onClick={() => toggleDropdown(item.key)}
                      onKeyDown={(e) => { if (e.key === "ArrowDown") setActiveDropdown(item.key); }}
                    >
                      <span className={s.btnLabel}>{item.label}</span>
                      <ChevronDown className={`${s.chev} ${isOpen ? s.chevOpen : ""}`} />
                    </button>

                    {isOpen && (
                      <motion.div
                        id={`${item.key}-menu`}
                        role="menu"
                        className={s.dropdown}
                       initial={prefersReducedMotion ? false : { opacity: 0 }}
animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                      
                         exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                   transition={{ duration: 0.14 }}
                      >
                        {item.subitems!.map((sub) => (
                          <NavLink
                            key={sub.key}
                            to={sub.to}
                            role="menuitem"
                            className={({ isActive }) => `${s.dropBtn} ${isActive ? s.dropBtnActive : ""}`}
                            onClick={() => { closeDropdown(); setMobileOpen(false); }}
                          >
                            {sub.icon && <span className={s.dropIcon} aria-hidden="true">{sub.icon}</span>}
                            <span>{sub.label}</span>
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) => `${s.btn} ${isActive ? s.btnActive : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        {/* Acciones (idioma) */}
        <div className={s.auth}>
          <button
            className={s.ghost}
            onClick={toggleLang}
            aria-label={i18n.language.startsWith("es") ? "Cambiar a inglés" : "Switch to Spanish"}
            title={i18n.language.startsWith("es") ? "ES" : "EN"}
          >
            {i18n.language.startsWith("es") ? "ES" : "EN"}
            <img
    src={i18n.language.startsWith("es")
      ? "https://flagcdn.com/w20/es.png"
      : "https://flagcdn.com/w20/us.png"}
    alt={i18n.language.startsWith("es") ? "Español" : "English"}
    className={s.flagIcon}
  />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";           // ✅ usa el router
import s from "./Header.module.css";

// Si prefieres lucide-react, instala: npm i lucide-react
// import { ChevronDown } from "lucide-react";
function ChevronDown({ className }: { className?: string }) {             // ✅ SVG inline (sin deps)
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface MenuItem {
  key: string;
  label: string;
  to: string;
  subitems?: { key: string; label: string; to: string; icon?: string }[];
}

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const headerTransform = Math.min(scrollY * 0.3, 100);

  const menuItems: MenuItem[] = [
    { key: "start", label: "Start", to: "/" },
    { key: "story-telling", label: "Story Telling", to: "/story-telling" },
    { key: "game", label: "Game", to: "/game" },
    { key: "simulation", label: "Simulation", to: "/simulation" },
    { key: "machine-learning", label: "Machine Learning", to: "/machine-learning" },
    {
      key: "impact-zone",
      label: "Impact Zone",
      to: "/impact-zone",
      subitems: [
        { key: "impact-zone", label: "Live Simulation", to: "/impact-zone", icon: "⚡" },
        { key: "impact-catalog", label: "Impact Catalog", to: "/impact-catalog", icon: "📚" },
      ],
    },
  ];

  return (
    <motion.header
      className={s.header}
      style={{ transform: `translateY(${headerTransform}px)` }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={s.inner}>
        {/* Brand */}
        <div className={s.brand}>
          <div className={s.logo}><span style={{ fontSize: 18 }}>🛡️</span></div>
          <h1 className={s.title}>Earth Defender</h1>
        </div>

        {/* Nav (desktop) */}
        <nav className={s.nav}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={s.item}
              onMouseEnter={() => item.subitems && setActiveDropdown(item.key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `${s.btn} ${isActive ? s.btnActive : ""}`}
              >
                {item.label}
                {item.subitems && (
                  <ChevronDown className={`${s.chev} ${activeDropdown === item.key ? s.chevOpen : ""}`} />
                )}
              </NavLink>

              {item.subitems && activeDropdown === item.key && (
                <motion.div
                  className={s.dropdown}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {item.subitems.map((sub) => (
                    <NavLink
                      key={sub.key}
                      to={sub.to}
                      className={({ isActive }) => `${s.dropBtn} ${isActive ? s.dropBtnActive : ""}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {sub.icon && <span style={{ fontSize: 18 }}>{sub.icon}</span>}
                      {sub.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth */}
        <div className={s.auth}>
          <button className={s.ghost}>Login</button>
          <button className={s.primary}>Register</button>
        </div>
      </div>
    </motion.header>
  );
}

// src/component/navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LucideProps } from 'lucide-react';
import {
  Menu, X, Download, FileText,
  Github, Linkedin, Youtube,
  Handshake, Telescope, GraduationCap, LayoutDashboard, Mail,HomeIcon
} from 'lucide-react';
import { IconMeteor } from '@tabler/icons-react';

type LinkItem = {
  id: string;
  name: string;
  Icon?: React.ComponentType<LucideProps>;
  showIcon?: boolean;
  showText?: boolean;
  iconPosition?: 'left' | 'right';
  path?: string; // si existe => navegar; si no => scroll
};

const LINKS: LinkItem[] = [
  { id: 'home', name: 'Home', Icon: HomeIcon, showText: false,showIcon: true, iconPosition: 'left' ,path: '/neoscience'  },
  { id: 'simulation', name: 'Simulation', Icon: Telescope, showIcon: true, showText: true, iconPosition: 'left',path: '/simulation'  },
  { id: 'learn', name: 'Learn', Icon: GraduationCap, showIcon: true, showText: true, iconPosition: 'left',path: '/learn'  },
  { id: 'dashboard', name: 'Dashboard', Icon: LayoutDashboard, showIcon: true, showText: true, iconPosition: 'left',path: '/dashboard'  },
  { id: 'aboutus', name: 'About', Icon: Handshake, showIcon: true, showText: true, iconPosition: 'left', path: '/about' },
  { id: 'contact', name: 'Contact', Icon: Mail, showIcon: true, showText: false,path: '/contact' }, // ejemplo: solo ícono
];

const SOCIAL = [
  { name: 'GitHub', url: 'https://github.com/NeoScience', icon: <Github className="w-5 h-5" /> },

  { name: 'YouTube', url: 'https://youtube.com', icon: <Youtube className="w-5 h-5" /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detecta sección activa por scroll (para items sin path)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = LINKS
        .filter(l => !l.path) // solo secciones del landing
        .map(l => document.getElementById(l.id));

      const y = window.scrollY + 100; // offset
      for (const sec of sections) {
        if (!sec) continue;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (y >= top && y < bottom) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    handleScroll(); // inicial
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const isItemActive = (item: LinkItem) =>
    item.path ? location.pathname === item.path : activeSection === item.id;

  const handleItemClick = (item: LinkItem) => {
    if (item.path) {
      navigate(item.path);
      setMobileMenuOpen(false);
    } else {
      scrollToSection(item.id);
    }
  };

  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = '/Tabe-Rickson.pdf';
    a.download = 'Tabe Rickson.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setShowResumeModal(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full px-2 py-5"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div
            className={`flex items-center justify-between p-3 rounded-full transition-all duration-300
            ${scrolled
              ? 'backdrop-blur-xl bg-purple-900/40 border border-white/20 shadow-lg'
              : 'backdrop-blur-md bg-purple-700/60 border border-white/10'
            }`}
          >
            {/* Logo */}
            <a href="/neoscience" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden shadow-lg"
              > 
                {/* Pon tu archivo en /public */}
                <img
                  src="/logo-neoscience-round.svg"
                  alt="NeoScience"
                  className="w-full h-full object-cover"
                /> 
              </motion.div>
              Neoscience
               
             
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {LINKS.map(item => {
                const active = isItemActive(item);
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all relative overflow-hidden
                      ${active ? 'text-white' : 'text-white/70 hover:text-white'}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navActiveIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 rounded-full"
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                      />
                    )}

                    <span className="relative z-10 inline-flex items-center gap-2">
                      {item.showIcon && item.iconPosition !== 'right' && item.Icon && (
                        <item.Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                      )}
                      {item.showText !== false && <span>{item.name}</span>}
                      {item.showIcon && item.iconPosition === 'right' && item.Icon && (
                        <item.Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Social + meteor + CV (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {SOCIAL.map(s => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
                  aria-label={s.name}
                >
                  {s.icon}
                </motion.a>
              ))}

              <motion.span
                className="inline-flex items-center justify-center text-white ml-1"
                animate={{ x: [0, 8, 0], rotate: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                aria-label="meteor"
                title="Hyperdrive engaged"
              >
                <IconMeteor size={24} stroke={1.8} className="text-white/95" />
              </motion.span>

              
            </div>

            {/* Mobile menu toggle */}
            <motion.button
              className="lg:hidden p-2 rounded-lg text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(s => !s)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden mt-2 mx-4 rounded-xl backdrop-blur-xl bg-black/80 border border-white/10 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col p-4">
                {LINKS.map(item => {
                  const active = isItemActive(item);
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-3 rounded-lg text-left text-sm font-medium capitalize transition
                        ${active ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {item.showIcon && item.Icon && <item.Icon className="h-4 w-4" strokeWidth={1.8} />}
                        {item.showText !== false && item.name}
                      </span>
                    </motion.button>
                  );
                })}

                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
                  {SOCIAL.map(s => (
                    <motion.a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
                      aria-label={s.name}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>

                <motion.button
                  onClick={() => setShowResumeModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Modal CV */}
      <AnimatePresence>
        {showResumeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download Resume</h3>
                <p className="text-gray-300 mb-6">
                  Would you like to download my resume in PDF format?
                </p>

                <div className="flex gap-3 w-full">
                  <motion.button
                    onClick={() => setShowResumeModal(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={downloadResume}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

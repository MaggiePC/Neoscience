import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 👈 aquí está la magia
import s from "./StoryTelling.module.css";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function StoryTelling() {
  const navigate = useNavigate(); // 👈 para moverse entre páginas
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookOpen, setIsBookOpen] = useState(false);

  const storyPages = [
    {
      title: "The Beginning",
      content:
        "In the vast cosmos, countless celestial bodies dance through space...",
    },
    {
      title: "The Discovery",
      content:
        "Scientists around the world work tirelessly to track these cosmic visitors...",
    },
    {
      title: "The Classification",
      content:
        "Not all NEOs are created equal. Some are classified as Potentially Hazardous Asteroids...",
    },
    {
      title: "The Mission",
      content:
        "Understanding these objects is crucial for planetary defense...",
    },
    {
      title: "The Future",
      content:
        "Today, you have the power to explore this knowledge...",
    },
  ];

  // abre el libro automáticamente
  useEffect(() => {
    const t = setTimeout(() => setIsBookOpen(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, storyPages.length - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  return (
    <div className={s.wrap}>
      <div className={s.container}>
        {/* Libro */}
        <motion.div
          className={s.bookWrap}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            className={s.book}
            animate={{ rotateY: isBookOpen ? -15 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Página izquierda */}
            <motion.div className={s.left}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-${currentPage}`}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.45 }}
                >
                  {currentPage > 0 && (
                    <>
                      <h2 className={s.title}>
                        {storyPages[currentPage - 1].title}
                      </h2>
                      <p className={s.text}>
                        {storyPages[currentPage - 1].content}
                      </p>
                      <div className={s.thumb}>📖</div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Página derecha */}
            <motion.div className={s.right}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-${currentPage}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45 }}
                >
                  <h2 className={s.title}>{storyPages[currentPage].title}</h2>
                  <p className={s.text}>{storyPages[currentPage].content}</p>
                  <div className={s.thumb}>🌌</div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Lomo */}
            <div className={s.spine} />
          </motion.div>
        </motion.div>

        {/* Controles */}
        <div className={s.controls}>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={s.btn}
          >
            <ChevronLeftIcon className={s.icon} /> Previous
          </button>

          <div className={s.dots}>
            {storyPages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`${s.dot} ${i === currentPage ? s.dotActive : ""}`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === storyPages.length - 1}
            className={s.btn}
          >
            Next <ChevronRightIcon className={s.icon} />
          </button>
        </div>

        {/* CTA final */}
        {currentPage === storyPages.length - 1 && (
          <motion.div
            className={s.ctaBox}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              className={s.btnPrimary}
              onClick={() => navigate("/game")} // 👈 ahora navega con router
            >
              Continue to Defense Game 🚀
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

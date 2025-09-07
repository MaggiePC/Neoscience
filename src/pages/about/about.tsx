'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe } from 'lucide-react';

// ======== Tipos ========
type SocialLinks = {
  linkedin?: string;
  github?: string;
  website?: string;
};

type Member = {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  photo: string;      // ruta a la imagen
  links?: SocialLinks;
};

// ======== Datos (TEAM) ========
const TEAM: Member[] = [
  {
    id: 1,
    name: 'Wagner Nolasco Ramírez Klínger',
    role: 'FISIC',
    bio: 'Apasionado por la visualización de datos y experiencias interactivas para educación científica.',
    photo: '/NolascoFoto.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/tu-perfil', // <-- pon el real
      github: 'https://github.com/tu-usuario'
    }
  },
  // Añade más miembros aquí:
  // {
  //   id: 2,
  //   name: 'Nombre Apellido',
  //   role: 'Rol',
  //   bio: 'Breve bio…',
  //   photo: '/foto.png',
  //   links: { linkedin: '', github: '', website: '' }
  // },
];

// Si quieres paginar el equipo (opcional)
const PAGE_SIZE = 6;

// Animaciones reutilizables
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.08 * i }
  })
};

export default function AboutTeam() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(TEAM.length / PAGE_SIZE);
  const pageSlice = TEAM.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section id="about" className="relative w-full bg-black text-white">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 pt-20 pb-10">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <img
            src="/iconoLogoAzul.jpg"
            alt="NeoScience"
            width={280}
            height={280}
            loading="lazy"
            className="block mx-auto w-48 md:w-64 lg:w-72 h-auto rounded-full ring-2 ring-purple-600/40 shadow-[0_0_50px_-20px_rgba(168,85,247,.6)]"
          />

          {/* Marca */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-center">
            
          </h1>

          {/* Subtítulo */}
          <p className="text-base md:text-lg font-mono text-center bg-black/30 backdrop-blur px-3 py-1 rounded-lg">
            <span className="bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text text-transparent">
              NASA Space Apps Challenge
            </span>
          </p>
        </div>
      </div>

      {/* THE CHALLENGE */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
        <motion.div
          className="mb-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
            <span className="text-blue-300">THE </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CHALLENGE
            </span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600 mt-3 w-80" />
        </motion.div>

        <motion.p
          className="text-white/80 md:text-lg leading-relaxed md:leading-8 text-justify max-w-6xl mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          A newly identified near-Earth asteroid, "Impactor-2025," poses a potential threat to Earth, but do we have the
          tools to enable the public and decision makers to understand and mitigate its risks? NASA datasets include
          information about known asteroids and the United States Geological Survey provides critical information that
          could enable modeling the effects of asteroid impacts, but these data need to be integrated to enable effective
          visualization and decision making. Your challenge is to develop an interactive visualization and simulation tool
          that uses real data to help users model asteroid impact scenarios, predict consequences, and evaluate potential
          mitigation strategies.
        </motion.p>
      </div>

      {/* OUR TEAM */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 pb-20">
        <motion.div
          className="mb-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
            <span className="text-blue-400">OUR </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TEAM
            </span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-600 mt-3 w-80" />
        </motion.div>

        {/* Grid de miembros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageSlice.map((m, i) => (
            <motion.article
              key={m.id}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/70 hover:bg-gray-900/90 transition-colors"
            >
              {/* Foto */}
              <div className="relative h-56 bg-gray-800">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-semibold">{m.name}</h3>
                {m.role && <p className="text-white/70 text-sm mt-0.5">{m.role}</p>}
                {m.bio && <p className="text-white/80 text-sm mt-3">{m.bio}</p>}

                {/* Social */}
                {(m.links?.linkedin || m.links?.github || m.links?.website) && (
                  <div className="flex gap-3 mt-4">
                    {m.links?.linkedin && (
                      <a
                        href={m.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label={`${m.name} – LinkedIn`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {m.links?.github && (
                      <a
                        href={m.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label={`${m.name} – GitHub`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {m.links?.website && (
                      <a
                        href={m.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition"
                        aria-label={`${m.name} – Website`}
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Paginación opcional */}
        {TEAM.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${
                page === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  page === n
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-white/70 hover:bg-gray-700'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md ${
                page === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

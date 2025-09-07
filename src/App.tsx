// App.tsx
import Galaxy from "./backgrounds/GalaxyBackground";
import Navbar from "./components/navbar/Navbar";
import NeoScience from "./pages/home/NeoScience";
import "./styles/globals.css";        // o ./index.css si así lo tienes

// main.tsx o App.tsx
import { createBrowserRouter, RouterProvider,Navigate  } from "react-router-dom";
import AboutUs from "./pages/about/about";
import AboutUs2 from "./pages/about/AboutUs";
import Contact from "./pages/contact/Contact";
import Learn from "./pages/learn/Learn";
import Simulation from "./pages/simulation/Simulation";
import Dashboard from "./pages/dashboard/Dashboard";

import { Routes, Route } from "react-router-dom";



export default function App() {
  return (
    <>
  
      {/* Fondo global fijo, detrás de todo */}
      <div className="fixed inset-0 -z-10">
       
      </div>

      {/* Contenido */}
      <Navbar />
      <main className="min-h-[100svh] pt-24">
      
        <Routes>
         
          <Route path="/neoscience" element={<NeoScience />} />
          <Route path="/about" element={<AboutUs />} />
           <Route path="/about2" element={<AboutUs2 />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/learn" element={<Learn />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/dashboard" element={<Dashboard />} />

       <Route path="*" element={<Navigate to="/neoscience" replace />} />
        </Routes>
      </main>
    </>
  );
}

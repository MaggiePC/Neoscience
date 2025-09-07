import s from "./Home.module.css";
import RotatingText from '../../backgrounds/rotatingtext';
import { Github, Linkedin, Mail, X } from "lucide-react";

export default function Home(){
  return (
    <section className={s.hero}>
      <div className="shell">
        
        <RotatingText
            texts={["START", "SIMULATION"]}
            mainClassName="px-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white overflow-hidden pt-3 pb-2 justify-center rounded-lg"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={4000}
          />
    
      </div>
    </section>
  );
}

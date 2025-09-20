import { motion } from "framer-motion";
import s from "./Starfield.module.css";
export default function Starfield(){
  return (
    <div className={s.wrap} aria-hidden>
      {Array.from({length:50}).map((_,i)=>(
        <motion.div
          key={i}
          className={s.star}
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
          animate={{ opacity:[0.3,1,0.3], scale:[0.5,1,0.5] }}
          transition={{ duration: 2 + Math.random()*3, repeat: Infinity, delay: Math.random()*2 }}
        />
      ))}
    </div>
  );
}

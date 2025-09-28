import { Outlet, useLocation, Link } from "react-router-dom";
import Header from "../components/HeaderMenu";
import Footer from "../components/Footer";
import Starfield from "./Starfield";
import s from "./MainLayout.module.css";

const steps = [
  { key: "/story-telling", icon: "📖", label: "Story" },
  { key: "/game",          icon: "🎮", label: "Game" },
  { key: "/simulation",    icon: "🌌", label: "Sim" },
  { key: "/machine-learning", icon:"🤖", label:"ML" },
  { key: "/impact-zone",   icon: "💥", label: "Impact" },
  { key: "/impact-catalog",icon: "📚", label: "Catalog" },
];

export default function MainLayout(){
  const { pathname } = useLocation();
  const isStart = pathname === "/";
  const isStep = steps.some(s => s.key === pathname);

  return (
    <div className={s.wrap}>
      <Starfield/>

      <header className={s.header}>
        <div className="container">
          <Header/>
        </div>
      </header>

      <main className={s.main}>
        <div className="container">
          <Outlet/>
        </div>
      </main>

      <footer className={s.footer}>
        <div className="container"><Footer/></div>
      </footer>

      {!isStart && (
        <div className={s.fab}>
          <Link to="/" className={s.fabBtn} title="Back to Home">🏠</Link>
        </div>
      )}

      {isStep && (
        <div className={s.sidebar}>
          <div className={s.sideBox}>
            <div style={{display:"grid", gap:8}}>
              {steps.map(st => (
                <Link key={st.key} to={st.key}
                  className={`${s.sideBtn} ${pathname===st.key ? s.sideBtnActive : ""}`}
                  title={st.label}
                >
                  {st.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

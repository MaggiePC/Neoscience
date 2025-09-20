import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      // si querés validar origen: if (e.origin !== window.location.origin) return;
      const data = e?.data || {};
      if ((data.type === "GO_STORY" || data.action === "go") && data.route) {
        navigate(data.route); // "/story-telling"
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [navigate]);

  return (
    <iframe
      src="/earth.html"
      title="Earth 3D"
      style={{
        position: "fixed",
        top: "var(--header-h,72px)",
        left: 0,
        width: "100vw",
        height: "calc(100dvh - var(--header-h,72px) - var(--footer-h,96px))",
        border: 0,
        zIndex: 0,
      }}
    />
  );
}

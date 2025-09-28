// App.tsx (o donde tienes el router)
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import StoryTelling from "./pages/StoryTelling";
import NewsOfWeek from "./pages/NewsOfWeek";
import Game from "./pages/Game";

const router = createBrowserRouter([
  // Rutas con layout (sí muestran header/footer)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "story-telling", element: <StoryTelling /> },
      { path: "newsOfWeek", element: <NewsOfWeek /> },
    ],
  },
  // Ruta sin layout (no muestra header/footer)
  { path: "/game", element: <Game /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import StoryTelling from "./pages/StoryTelling";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "story-telling", element: <StoryTelling /> },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

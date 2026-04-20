import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

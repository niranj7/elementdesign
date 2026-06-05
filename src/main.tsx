import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Handle global loader fadeout after mount
const loader = document.getElementById("global-loader");
const progressBar = document.querySelector(".loader-progress-bar") as HTMLElement;

if (progressBar) {
  progressBar.style.width = "100%";
}

if (loader) {
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.remove();
    }, 800);
  }, 400); // Small delay for visual completion of progress bar
}

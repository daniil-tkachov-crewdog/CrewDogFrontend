import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { setupConsentOnBoot } from "@/analytics/consent";
setupConsentOnBoot();

createRoot(document.getElementById("root")!).render(<App />);

import { router } from "./router";

window.addEventListener("popstate", router); // Handle back/forward navigation
router(); // Run on initial load

import { scriptPage } from "./src/script";
import { signscriptPage } from "./src/signscript";

type Route = {
  path: string;
  view: () => void;
};

const routes: Route[] = [
  { path: "/", view: signscriptPage },
  { path: "/game", view: scriptPage },
  { path: "/login", view: signscriptPage },
  { path: "/signup", view: signscriptPage },
];

const navigateTo = (url: string) => {
  history.pushState(null, "", url); // Update the browser URL
  router(); // Call the router function to handle the new route
};

export const router = () => {
  document.addEventListener("DOMContentLoaded", (event) => {
    const currentPath = location.pathname; // Get the current path

    const route = routes.find((r) => r.path === currentPath); // Match the path
    if (route) {
      route.view(); // Call the view function for the route
    } else {
      console.error("Route not found");
    }

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLAnchorElement;

      if (target.tagName === "A" && target.href.startsWith(location.origin)) {
        event.preventDefault(); // Stop the default navigation
        navigateTo(target.href); // Use the custom navigation
      }
    });
  });
};

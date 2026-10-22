import type { useAuth0 } from "@auth0/auth0-react";

/**
 * Clear all browser-side state (storage + Auth0/token caches) before logging out.
 */
export const clearBrowserSession = () => {
  localStorage.clear();
  sessionStorage.clear();

  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name.includes("auth0") || name.includes("token")) {
          caches.delete(name);
        }
      });
    });
  }
};

/**
 * Full logout used by the Log Out buttons: confirm, clear browser state, then
 * log out of Auth0 and the federated IdP.
 */
export const performFullLogout = (logout: ReturnType<typeof useAuth0>["logout"]) => {
  if (window.confirm("Are you sure you want to log out?")) {
    // Enhanced universal logout - clear all browser storage
    clearBrowserSession();

    // Small delay to ensure cleanup completes before logout
    setTimeout(() => {
      logout({
        logoutParams: {
          returnTo: window.location.origin,
          federated: true,
          // Force logout from IdP regardless of session state
          prompt: "none",
        },
      });
    }, 100);
  }
};

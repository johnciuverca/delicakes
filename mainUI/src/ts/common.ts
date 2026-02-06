export function onReady(callback: () => void): void {
      if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
            return;
      }
      callback();
}

export function setActiveNavLink(): void {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".navbar a"));
      if (links.length === 0) return;

      const currentPath = window.location.pathname.replace(/\/+$/, "");

      for (const link of links) {
            const href = link.getAttribute("href");
            if (!href) continue;

            try {
                  const resolved = new URL(href, window.location.origin);
                  const linkPath = resolved.pathname.replace(/\/+$/, "");

                  if (linkPath === currentPath) {
                        link.setAttribute("aria-current", "page");
                        link.classList.add("active");
                  } else {
                        link.removeAttribute("aria-current");
                        link.classList.remove("active");
                  }
            } catch {
                  // Ignore invalid hrefs
            }
      }
}

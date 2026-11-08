// Download the search component and index only when the visitor opens search.
const ninjaKeys = document.querySelector("ninja-keys");
let searchReady;

function loadSearch() {
  if (!searchReady) {
    searchReady = import(ninjaKeys.dataset.moduleSrc)
      .then(() => customElements.whenDefined("ninja-keys"))
      .then(
        () =>
          new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = ninjaKeys.dataset.searchDataSrc;
            script.onload = resolve;
            script.onerror = () => {
              script.remove();
              reject(new Error("Unable to load the search index"));
            };
            document.head.appendChild(script);
          })
      )
      .catch((error) => {
        searchReady = undefined;
        throw error;
      });
  }
  return searchReady;
}

async function openSearchModal() {
  const button = document.getElementById("search-toggle");
  button?.setAttribute("aria-busy", "true");
  try {
    await loadSearch();
    ninjaKeys.classList.toggle("dark", determineComputedTheme() === "dark");
    const navbar = document.getElementById("navbarNav");
    if (navbar?.classList.contains("show")) $(navbar).collapse("hide");
    ninjaKeys.open();
  } catch (error) {
    console.error("Search could not be opened. Please try again.", error);
  } finally {
    button?.removeAttribute("aria-busy");
  }
}

// Capture the shortcut before the component exists, without handling it twice.
document.addEventListener(
  "keydown",
  (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      event.stopImmediatePropagation();
      openSearchModal();
    }
  },
  true
);

const THEME_KEY = "tododolix-theme";
const DEVICE_QUERY_KEY = "device";
const LANDING_LANGUAGE_QUERY_KEY = "lang";
const DEFAULT_LANGUAGE = "de";

const translations = {
  de: {
    pageTitle: "Tododolix | Fokus für Aufgaben auf Desktop und Mobile",
    pageDescription:
      "Tododolix ist ein modernes Aufgaben-Tool für Desktop und Mobile. Plane, priorisiere und erledige Aufgaben in einer schnellen, lokalen Experience.",
    brandAriaLabel: "Tododolix Startseite",
    brandTagline: "Tasks in klaren Flows",
    navProduct: "Produkt",
    navFeatures: "Features",
    navAbout: "About",
    openTool: "Zum Tool",
    menuAriaLabel: "Menü öffnen",
    heroEyebrow: "Desktop Power. Mobile Speed. Ein Produkt.",
    heroTitle: "Ein Aufgaben-Tool, das direkt in den Flow schaltet.",
    heroText:
      "Tododolix ist für schnelles Planen, Priorisieren und Erledigen gemacht. Auf Desktop mit Fokus-Workspace, auf Mobile mit kompakter Tagesansicht.",
    heroNote: "Beim Öffnen wird automatisch die passende Version für dein Gerät geladen.",
    liveProduct: "Live Product",
    showcaseTitle: "Fokus statt Feature-Lärm",
    showcaseText: "Klare Aufgaben, schnelle Erfassung, visuelle Priorisierung und direkte Bearbeitung.",
    desktopLabel: "Desktop",
    desktopText: "Breite Planungsansicht mit Workspace-Charakter",
    mobileLabel: "Mobile",
    mobileText: "Schnelles Erfassen, Filtern und Durcharbeiten unterwegs",
    coreModel: "Core Model",
    coreModelTitle: "Ein Produktkern, zwei Interfaces",
    timelineCapture: "Capture",
    timelinePrioritize: "Priorisieren",
    timelineExecute: "Execute",
    timelineArchive: "Archive",
    productLabel: "About The Product",
    productTitle: "Gebaut für klare Organisation ohne unnötige Reibung.",
    productText:
      "Die Idee hinter Tododolix war, Organisation einfacher, moderner und unkomplizierter zu machen. Statt überladener Tools setzt das Produkt auf eine klare Übersicht, schnelle Entscheidungen und zwei gezielt abgestimmte Oberflächen: Desktop für strukturierte Planung und Mobile für den direkten Zugriff unterwegs.",
    featuresLabel: "Features",
    featuresTitle: "Konkrete Funktionen statt großer Worte.",
    featureFastTitle: "Schnelle Erfassung",
    featureFastText: "Erstelle Aufgaben in Sekunden inklusive Datum, Uhrzeit und Dauer.",
    featurePriorityTitle: "Klare Prioritäten",
    featurePriorityText: "Arbeite mit Low, Medium und High sowie farbigen Karten für sofortiges Scannen.",
    featureFlowTitle: "Status-Flow",
    featureFlowText: "Von offen zu in Arbeit bis erledigt oder archiviert, ohne Umwege.",
    featureFilterTitle: "Filter und Fokus",
    featureFilterText: "Filtere nach Zeitraum und Priorität, um genau das zu sehen, was jetzt zählt.",
    featureReminderTitle: "Lokale Erinnerungen",
    featureReminderText: "Nutze browserbasierte Erinnerungen für Start- und Endzeitpunkte ohne Cloud-Zwang.",
    featurePlatformsTitle: "Desktop und Mobile",
    featurePlatformsText: "Öffne direkt die passende Version für dein Gerät.",
    aboutUsLabel: "About Us",
    aboutUsTitle: "Ein Produkt aus Praxis, Lernen und echtem Bedarf.",
    aboutUsText:
      "Tododolix entstand aus dem Wunsch, sich im Alltag besser organisieren zu können und dabei trotzdem in einer modernen, simplen Oberfläche zu bleiben. Für mich als Lernender in der Informatik war das Projekt doppelt wertvoll: als Werkzeug im eigenen Alltag und als praktischer Raum, um beim Entwickeln echte Learnings mitzunehmen.",
    whyExistsLabel: "Why It Exists",
    whyExistsTitle: "Weniger Chaos zwischen Plan und Umsetzung.",
    whyExistsText:
      "Die Grundidee ist einfach: Aufgaben sollen schnell erfassbar, klar priorisiert und ohne Umwege bearbeitbar sein. Tododolix verbindet genau diesen Anspruch mit dem Gedanken, ein eigenes Produkt Schritt für Schritt weiterzuentwickeln und daran technisch zu wachsen."
  },
  en: {
    pageTitle: "Tododolix | Focus for tasks on desktop and mobile",
    pageDescription:
      "Tododolix is a modern task tool for desktop and mobile. Plan, prioritize, and complete tasks in a fast local experience.",
    brandAriaLabel: "Tododolix home",
    brandTagline: "Tasks in clear flows",
    navProduct: "Product",
    navFeatures: "Features",
    navAbout: "About",
    openTool: "Open Tool",
    menuAriaLabel: "Open menu",
    heroEyebrow: "Desktop power. Mobile speed. One product.",
    heroTitle: "A task tool that drops straight into your flow.",
    heroText:
      "Tododolix is built for fast planning, clear prioritization, and getting things done. On desktop with a focused workspace, on mobile with a compact daily view.",
    heroNote: "When opened, the right version for your device loads automatically.",
    liveProduct: "Live Product",
    showcaseTitle: "Focus instead of feature noise",
    showcaseText: "Clear tasks, fast capture, visual prioritization, and direct editing.",
    desktopLabel: "Desktop",
    desktopText: "Wide planning view with a true workspace feel",
    mobileLabel: "Mobile",
    mobileText: "Quick capture, filtering, and execution on the go",
    coreModel: "Core Model",
    coreModelTitle: "One product core, two interfaces",
    timelineCapture: "Capture",
    timelinePrioritize: "Prioritize",
    timelineExecute: "Execute",
    timelineArchive: "Archive",
    productLabel: "About The Product",
    productTitle: "Built for clear organization without unnecessary friction.",
    productText:
      "Tododolix started with a simple goal: make personal organization easier, cleaner, and more modern. Instead of overloaded tools, it focuses on a simple overview, quick decisions, and two purpose-built interfaces: desktop for structured planning and mobile for fast access on the go.",
    featuresLabel: "Features",
    featuresTitle: "Concrete functionality instead of big claims.",
    featureFastTitle: "Fast capture",
    featureFastText: "Create tasks in seconds including date, time, and duration.",
    featurePriorityTitle: "Clear priorities",
    featurePriorityText: "Work with low, medium, and high plus color-coded cards for instant scanning.",
    featureFlowTitle: "Status flow",
    featureFlowText: "Move from open to in progress to done or archived without friction.",
    featureFilterTitle: "Filters and focus",
    featureFilterText: "Filter by time range and priority so you only see what matters right now.",
    featureReminderTitle: "Local reminders",
    featureReminderText: "Use browser-based reminders for start and end times without cloud lock-in.",
    featurePlatformsTitle: "Desktop and mobile",
    featurePlatformsText: "Open the right version directly for your device.",
    aboutUsLabel: "About Us",
    aboutUsTitle: "A product shaped by real use, learning, and curiosity.",
    aboutUsText:
      "Tododolix grew out of the need to stay better organized in everyday life while keeping the experience modern and simple. As an IT apprentice, building it was valuable in two ways: it became a useful personal tool and a hands-on way to learn through creating a real product.",
    whyExistsLabel: "Why It Exists",
    whyExistsTitle: "Less chaos between planning and execution.",
    whyExistsText:
      "The core idea is straightforward: tasks should be quick to capture, easy to prioritize, and simple to work through. Tododolix combines that practical goal with the ambition to keep improving a real product and grow technically through the process."
  }
};

function getViewportSize() {
  const vv = window.visualViewport;
  const viewportWidth = vv?.width || window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = vv?.height || window.innerHeight || document.documentElement.clientHeight || 0;
  return { viewportWidth: Math.round(viewportWidth), viewportHeight: Math.round(viewportHeight) };
}

function getPreferredTheme() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());
}

function detectLandingLanguage() {
  const url = new URL(window.location.href);
  const forcedLanguage = url.searchParams.get(LANDING_LANGUAGE_QUERY_KEY);

  if (forcedLanguage && translations[forcedLanguage]) {
    return forcedLanguage;
  }

  const browserLanguage =
    navigator.language ||
    navigator.languages?.[0] ||
    DEFAULT_LANGUAGE;
  const normalizedLanguage = String(browserLanguage).toLowerCase();

  if (normalizedLanguage.startsWith("de")) {
    return "de";
  }

  return "en";
}

function applyLandingLanguage(language) {
  const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];

  document.documentElement.lang = language;
  document.title = dictionary.pageTitle;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", dictionary.pageDescription);
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (!key || !(key in dictionary)) {
      return;
    }

    node.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    const key = node.getAttribute("data-i18n-aria-label");
    if (!key || !(key in dictionary)) {
      return;
    }

    node.setAttribute("aria-label", dictionary[key]);
  });
}

function detectToolTarget() {
  const url = new URL(window.location.href);
  const forcedDevice = url.searchParams.get(DEVICE_QUERY_KEY);

  if (forcedDevice === "mobile") {
    return "./app/mobile/?source=forced";
  }

  if (forcedDevice === "desktop") {
    return "./app/desktop/?source=forced";
  }

  const ua = navigator.userAgent || "";
  const uaMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);
  const uaDataMobile = navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean"
    ? navigator.userAgentData.mobile
    : null;
  const { viewportWidth, viewportHeight } = getViewportSize();
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const anyCoarsePointer = window.matchMedia("(any-pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const narrowScreen = viewportWidth <= 900;
  const touchPoints = navigator.maxTouchPoints || 0;
  const hasTouch = "ontouchstart" in window || touchPoints > 0;
  const mobileViewport = narrowScreen && (coarsePointer || anyCoarsePointer || noHover || hasTouch);
  const emulatedMobile = narrowScreen;

  const mobileSignals = [
    uaMobile,
    uaDataMobile === true,
    mobileViewport,
    emulatedMobile,
    touchPoints > 1 && viewportHeight <= 950
  ].filter(Boolean).length;

  if (mobileSignals >= 1) {
    return "./app/mobile/";
  }

  return "./app/desktop/";
}

function syncToolLinks() {
  const links = document.querySelectorAll("#open-tool-top, #open-tool-hero, #open-tool-features");
  const target = detectToolTarget();

  links.forEach((link) => {
    link.setAttribute("href", target);
  });
}

function initToolLinks() {
  syncToolLinks();

  let resizeTimer = null;
  const refresh = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncToolLinks();
    }, 60);
  };

  window.addEventListener("resize", refresh);
  window.addEventListener("orientationchange", refresh);
  window.visualViewport?.addEventListener("resize", refresh);
}

function initMenuToggle() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("topnav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

applyLandingLanguage(detectLandingLanguage());
initThemeToggle();
initToolLinks();
initMenuToggle();

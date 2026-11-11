import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// test.globals is off so RTL's auto-cleanup never registers; without this DOM leaks between tests
afterEach(() => cleanup());

// real i18next init fetches over http and suspends; tests only need t() to echo the key
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// jsdom has no ResizeObserver, which Radix dialogs and popovers use to size themselves
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// jsdom has no matchMedia; tests behave like a desktop screen (min-width queries match, max-width and motion ones don't)
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: /min-width/.test(query),
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
}));

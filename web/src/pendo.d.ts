// Pendo agent analytics. The Pendo snippet adds `window.pendo` at runtime, so it
// may be missing (for example, before the snippet loads or when it's blocked).
interface Window {
  pendo?: {
    trackAgent: (eventType: string, metadata: object) => void;
  };
}

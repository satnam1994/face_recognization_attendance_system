interface BrowserWindow {
  location: {
    hostname: string;
  };
  sessionStorage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
}

export const getBrowserWindow = (): BrowserWindow | undefined =>
  (globalThis as typeof globalThis & { window?: BrowserWindow }).window;

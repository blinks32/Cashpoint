// Type definitions for Tawk.to
declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      visitor?: {
        name?: string;
        email?: string;
      };
      setAttributes?: (attributes: Record<string, any>) => void;
      addEvent?: (event: string, metadata?: Record<string, any>) => void;
      addTags?: (tags: string[]) => void;
      removeTags?: (tags: string[]) => void;
      toggle?: () => void;
      popup?: () => void;
      getWindowType?: () => string;
      showWidget?: () => void;
      hideWidget?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      endChat?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export {};
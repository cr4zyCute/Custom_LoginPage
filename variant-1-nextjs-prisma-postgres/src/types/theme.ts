export type LayoutType = 'Centered' | 'Split-Left' | 'Split-Right' | 'Full-Bg';
export type ThemeCategory = 'Professional' | 'Minimal' | 'Creative' | 'Premium' | 'Modern' | 'Retro' | 'Minimalist' | 'Corporate' | 'Modern Collection' | 'Retro Collection' | 'Minimalist Collection' | 'Corporate Collection' | 'Creative Collection';

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground?: string;
    secondary: string;
    secondaryForeground?: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    border: string;
    input: string;
    ring: string;
    radius: string; // e.g., "0.5rem"
  };
  typography: {
    fontFamily: string;
    headingFont: string;
  };
  components: {
    button: {
      variant: 'default' | 'outline' | 'ghost' | 'link';
      radius: string;
      shadow: string;
    };
    card: {
      radius: string;
      shadow: string;
      border: boolean;
    };
    input: {
      variant: 'default' | 'filled' | 'underlined';
      radius: string;
    };
  };
  assets?: {
    logo?: string;
    backgroundImage?: string;
    sidebarImage?: string;
    overlayOpacity?: number; // 0 to 1
  };
  animations?: {
    initial: any;
    animate: any;
    exit: any;
    transition: any;
  };
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  category: string; // Changed to string to support all variations
  layout: LayoutType;
  isPremium: boolean;
  isActive: boolean;
  config: ThemeConfig;
  createdAt: Date;
  updatedAt: Date;
}

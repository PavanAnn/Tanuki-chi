// styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      bg: string;
      unselected: string;
      sidebarBg: string;
      sidebarText: string;
      hover: string;
      active: string;
      activeText: string;
      cardBg: string;
      textPrimary: string;
      textSecondary: string;
      border: string;
      shadowColor: string;
      gradient: string;
    };
  }
}

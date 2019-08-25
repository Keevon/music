import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      darkest: string;
      dark: string;
      medium: string;
      light: string;
      lightest: string;
    }
  }
}
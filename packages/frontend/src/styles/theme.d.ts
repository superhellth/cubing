import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    graphColors: Record<string, string>; 
  }

  interface PaletteOptions {
    graphColors?: Record<string, string>;
  }
}
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    // Allows any string key, returns a color string
    graphColors: Record<string, string>; 
  }

  interface PaletteOptions {
    graphColors?: Record<string, string>;
  }
}
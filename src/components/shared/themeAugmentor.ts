import React from "react";
import { Theme, 
         Palette, PaletteOptions, PaletteColor, SimplePaletteColorOptions,
         ThemeOptions
       } from "@mui/material/styles";

declare module '@mui/material/styles' {

    /*
    interface Theme {      
      status: {
        danger: React.CSSProperties['color'];
      };
    }
    */
  
    interface Palette {
      contrast: Palette['primary'];
    }
    interface PaletteOptions {
      contrast: PaletteOptions['primary'];
    }
  
    interface PaletteColor {
      darker?: string;
    }
    interface SimplePaletteColorOptions {
      darker?: string;
    }
    /*
    interface ThemeOptions {
      status: {
        danger: React.CSSProperties['color'];
      };
    }
    */
}
  
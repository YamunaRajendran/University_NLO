// Using system fonts until we have the actual Neo Sans fonts
// const systemFonts = {
//     sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
//     arabic: ['Tahoma', 'Arial', 'sans-serif']
//   };
  
  // Export CSS variables for the fonts
  export const fontVariables = {
    neoSansBold: '--font-neo-sans-bold',
    neoSansMedium: '--font-neo-sans-medium',
    neoSans: '--font-neo-sans'
  };
  
  // Export font family strings
  export const fontFamilies = {
    neoSansBold: `var(${fontVariables.neoSansBold})`,
    neoSansMedium: `var(${fontVariables.neoSansMedium})`,
    neoSans: `var(${fontVariables.neoSans})`
  };
  
  import { Roboto } from 'next/font/google'
  import localFont from 'next/font/local'
  
  export const neoSansBold = localFont({
    src: [
      {
        path: '../fonts/NeoSansArabicBold.otf',
        weight: '700',
        style: 'normal',
      }
    ],
    variable: '--font-neo-sans-bold'
  })
  
  export const neoSansMedium = localFont({
    src: [
      {
        path: '../fonts/NeoSansArabicMedium.otf',
        weight: '500',
        style: 'normal',
      }
    ],
    variable: '--font-neo-sans-medium'
  })
  
  export const neoSansRegular = localFont({
    src: [
      {
        path: '../fonts/NeoSansArabic.otf',
        weight: '400',
        style: 'normal',
      }
    ],
    variable: '--font-neo-sans'
  })
  
  export const roboto = Roboto({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-roboto'
  })
  
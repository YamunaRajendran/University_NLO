export const brandColors = {
  primary: {
    light: {
      cmyk: { c: 72, m: 7, y: 28, k: 0 },
      rgb: { r: 42, g: 177, b: 187 }
    },
    medium: {
      cmyk: { c: 85, m: 58, y: 1, k: 0 },
      rgb: { r: 46, g: 107, b: 178 }
    },
    dark: {
      cmyk: { c: 100, m: 97, y: 33, k: 24 },
      rgb: { r: 33, g: 38, b: 94 }
    }
  },
  secondary: {
    green: {
      cmyk: { c: 86, m: 45, y: 60, k: 30 },
      rgb: { r: 31, g: 91, b: 88 }
    },
    pink: {
      cmyk: { c: 28, m: 84, y: 46, k: 8 },
      rgb: { r: 172, g: 72, b: 99 }
    },
    gray: {
      cmyk: { c: 57, m: 51, y: 35, k: 7 },
      rgb: { r: 119, g: 117, b: 134 }
    }
  }
};

export const typography = {
  english: {
    heading: "Neo Sans Bold",
    subHeading: "Neo Sans Medium",
    body: "Roboto Regular"
  },
  arabic: {
    heading: "Neo Sans Bold",
    subHeading: "Neo Sans Medium",
    body: "Frutiger LT Arabic Light"
  }
};

// Helper function to convert RGB to string
export const rgbToString = (rgb: { r: number, g: number, b: number }) => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

// Commonly used color combinations
export const chartColors = {
  employmentRate: {
    gradient: [rgbToString(brandColors.primary.light.rgb)],
    text: rgbToString(brandColors.primary.light.rgb)
  },
  averageSalary: {
    gradient: Array(4).fill(rgbToString(brandColors.secondary.pink.rgb)),
    text: rgbToString(brandColors.secondary.pink.rgb)
  },
  averageTimeToEmployment: {
    gradient: [rgbToString(brandColors.secondary.green.rgb)],
    text: rgbToString(brandColors.secondary.green.rgb)
  }
};

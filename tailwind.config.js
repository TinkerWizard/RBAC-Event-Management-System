module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Scan all JavaScript, TypeScript, and JSX/TSX files in the src folder
  ],
  theme: {
    extend: {},
    screens: {
      xs: { max: '639px' },
      sm: '640px', // Small devices
      md: '768px', // Medium devices
      lg: '1024px', // Large devices
      xl: '1280px', // Extra-large devices
    },
  },
  plugins: [],
};

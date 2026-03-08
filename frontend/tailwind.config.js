/** 
 * TAILWIND CSS CONFIGURATION
 * @type {import('tailwindcss').Config} 
 */
export default {
  /** 
   * CONTENT:
   * Tailwind searches these specific files for class names (like `bg-zinc-950`).
   * If it finds a class here, it automatically generates the real CSS for it behind the scenes!
   * This means our final CSS file only contains the styles we actually used.
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Search all JS/TS files in the src folder
  ],

  /** 
   * THEME:
   * Here we can override or add to Tailwind's default design system.
   */
  theme: {
    extend: {
      /**
       * COLORS:
       * We added our own custom shades of the "zinc" (grayish) palette here.
       * Because we defined `zinc-950` here, we can now type `bg-zinc-950` in App.tsx!
       */
      colors: {
        'zinc-950': '#09090b',
        'zinc-900': '#18181b',
        'zinc-800': '#27272a',
        'zinc-accent': '#3f3f46',
      }
    },
  },
  plugins: [],
}

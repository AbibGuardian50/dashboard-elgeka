/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'red': '#8B1A0F',
        'white': '#ffffff',
        'black': '#263238',
        'sulfurblack': '#040503',
        'lightwhite': 'rgba(255, 255, 255, 0.7)',
        'milkwhite' : 'F9F0EE',
        'lightgrey': '#F6F6F6',
        'bluegrey': '#64748b',
        'grey': '#D9D9D9',
        'orange': '#FF914C',
        'yellow': '#F3D42F',
        'greynight': '#BBB2B0',
      },
      fontFamily: {
        'inter' : ['inter', 'sans-serif'],
        'poppins': ["Poppins", 'sans-serif'],
        'gotham': ["gotham", 'sans-serif'],
      },
    },
    
  },
  plugins: [],
}


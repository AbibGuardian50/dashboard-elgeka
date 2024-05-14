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
        'transparentblack': '#000000B2',
        'lightwhite': 'rgba(255, 255, 255, 0.7)',
        'milkwhite' : 'F9F0EE',
        'offwhite': '#FFFFFFB2',
        'darkgrey': '#363636',
        'lightgrey': '#F6F6F6',
        'bluegrey': '#64748b',
        'grey': '#D9D9D9',
        'green': '#7FFF74',
        'orange': '#FF914C',
        'vibrantorange': '#FF6200',
        'yellow': '#F3D42F',
        'greynight': '#BBB2B0',
        'silver': '#D0D5DD',
        'teal': '#0A6B77',
      },
      fontFamily: {
        'inter' : ['inter', 'sans-serif'],
        'poppins': ["Poppins", 'sans-serif'],
        'gotham': ["gotham", 'sans-serif'],
        'verdana': ["verdana", 'sans-serif'],
      },
    },
    
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      fontSize: {
        'custom-size': '250px', // Or '1.6rem'
      },
      lineHeight: {
        'fulltight': '-0.5em', // Set line height to 0 for removal
      },
      colors:{
        'bgheader':"#f3e7e1",
        "orangetext":"#ee7257",
        "logobrown":"#95868e",
        "darkbody":"#1a1a1a",
        "darkheader":"#292828",
        "darktext":"#cccccc",
        "darkh1":"#ac9e8d",
        "darkh1sub":"#bb5a17",
        "darkh1sub":"#bb5a17",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
  
}



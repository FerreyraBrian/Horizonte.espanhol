module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',      /* Purple - buttons, links, primary actions */
        accent: '#F2994A',       /* Orange - highlights, icons, subtitles */
        background: '#F5F0FF',   /* Light purple - page background */
        foreground: '#1F1F1F',   /* Dark gray - main text */
        card: '#FFFFFF',         /* White - card backgrounds */
        success: '#10B981',      /* Green - completed lessons */
        warning: '#F59E0B',      /* Yellow - current lesson */
        locked: '#9CA3AF',       /* Gray - locked content */
      },
    },
  },
  plugins: [],
}

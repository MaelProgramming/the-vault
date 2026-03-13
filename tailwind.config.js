// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'vault-black': '#0A0A0A',
        'vault-gold': '#D4AF37',
        'vault-cream': '#F5F5DC', // Le fameux beige "Old Money"
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
      },
      keyframes: {
        'shimmer-line': {
          '0%': { width: '0%', opacity: '0' },
          '50%': { width: '100%', opacity: '1' },
          '100%': { width: '0%', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'shimmer-line': 'shimmer-line 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
    },
  },
}
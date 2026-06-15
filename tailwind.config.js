/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          light: "#dbeafe",
          dark: "#1d4ed8",
        },
        text: {
          DEFAULT: "#0a1628",
          2: "#1e3a5f",
          3: "#4b6a9b",
          4: "#7a9cc4",
        },
        border: {
          DEFAULT: "rgba(37, 99, 235, 0.09)",
          2: "rgba(37, 99, 235, 0.18)",
        },
        green: {
          DEFAULT: "#059669",
          2: "#10b981",
          light: "#ecfdf5",
        },
        orange: {
          DEFAULT: "#ea580c",
          2: "#f97316",
          light: "#fff7ed",
        },
        purple: {
          light: "#eff6ff",
        },
        bg: {
          DEFAULT: "#f8faff",
          2: "#f0f4ff",
          3: "#e4ecff",
        },
      },

      fontFamily: {
        sora: ["Sora", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)",
        "gradient-brand-soft": "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
        "gradient-hero": "radial-gradient(ellipse at 15% 50%, rgba(29, 78, 216, 0.11) 0%, transparent 58%), radial-gradient(ellipse at 85% 15%, rgba(2, 132, 199, 0.09) 0%, transparent 52%), radial-gradient(ellipse at 65% 85%, rgba(14, 165, 233, 0.07) 0%, transparent 48%), #f8faff",
      },

      boxShadow: {
        brand: "0 8px 32px rgba(29, 78, 216, 0.38)",
        sm: "0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)",
        md: "0 8px 28px rgba(29, 78, 216, 0.11), 0 4px 10px rgba(0, 0, 0, 0.05)",
        lg: "0 16px 48px rgba(29, 78, 216, 0.13), 0 8px 18px rgba(0, 0, 0, 0.06)",
        xl: "0 24px 72px rgba(29, 78, 216, 0.16), 0 12px 28px rgba(0, 0, 0, 0.08)",
      },

      borderRadius: {
        xs: "6px",
        sm: "10px",
        DEFAULT: "16px",
        lg: "22px",
        xl: "30px",
        "2xl": "40px",
        full: "9999px",
      },

      animation: {
        "blob-float": "blobFloat 12s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-card": "floatCard 5s ease-in-out infinite",
        "pulse-slow": "pulseSlow 2.2s ease infinite",
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "marquee": "marquee 25s linear infinite",
      },

      keyframes: {
        blobFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.97)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        floatCard: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1.5deg)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(1.2)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
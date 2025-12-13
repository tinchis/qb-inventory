/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,svelte}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['IBM Plex Mono', 'monospace'],
            },
            colors: {
                border: "hsl(240 3.7% 15.9%)",
                input: "hsl(240 3.7% 15.9%)",
                ring: "hsl(142.1 76.2% 36.3%)",
                background: "hsl(240 10% 3.9%)",
                foreground: "hsl(0 0% 98%)",
                primary: {
                    DEFAULT: "hsl(142.1 76.2% 36.3%)",
                    foreground: "hsl(144.9 80.4% 10%)",
                },
                secondary: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
                muted: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(240 5% 64.9%)",
                },
                accent: {
                    DEFAULT: "hsl(240 3.7% 15.9%)",
                    foreground: "hsl(0 0% 98%)",
                },
            },
        },
    },
    plugins: [],
}


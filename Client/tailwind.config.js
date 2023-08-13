/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		"w-64",
		"w-1/2",
		"rounded-l-lg",
		"rounded-r-lg",
		"bg-gray-200",
		"grid-cols-4",
		"grid-cols-7",
		"h-6",
		"leading-6",
		"h-9",
		"leading-9",
		"shadow-lg",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"subtle text": "#fa6161",
				primary: "#edc04b",
				secandary: "#4b4ded",
				dark: "#0e0e2c",
				success: "#31d0aa",
				text: "#4a4a68",
				subtitle: "#d9d9d9",
				light: "#fafcfe",
				subtext: "#d9d9d9",
				darkmode_icon: "#9b9b9b",
			},
			fontFamily: {
				sans: ["Graphik", "sans-serif"],
				serif: ["Merriweather", "serif"],
			},
			extend: {
				spacing: {
					128: "32rem",
					144: "36rem",
				},
				borderRadius: {
					"4xl": "2rem",
				},
			},
		},
	},
	plugins: [require("flowbite/plugin")],
};

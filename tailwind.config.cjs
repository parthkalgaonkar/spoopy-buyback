/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js}',
    './index.html'
  ],
  theme: {
    extend: {
			colors: {
				'srcblack': 			"#121212",
				'srcblack-light': "#1C1B19",
				'srcred': 				"#EF2F27",
				'srcgreen': 			"#519F50",
				'srcyellow': 			"#FBB829",
				'srcblue': 				"#2C78BF",
				'srcmagenta': 		"#E02C6D",
				'srccyan': 				"#0AAEB3",
				'srcwhite': 			"#d0bfa1",
				'srcgray-dark': 	"#303030",
				'srcgray': 				"#444444",
				'srcgray-light':	"#585858",
			},
		},
  },
  plugins: [],
}

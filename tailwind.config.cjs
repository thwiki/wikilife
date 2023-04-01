const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	safelist: [
		{
			pattern: /^(bg|border)-[^-]*-(300|500|700)$/,
		},
		{
			pattern: /^(text)-[^-]*-(200|500|800)$/,
		},
		{
			pattern: /^col-span-\d*$/,
		},
	],

	theme: {
		extend: {
			scale: {
				133: '1.3333333',
				66: '0.6666667',
			},
			width: {
				'16/12': '133.333333%',
				'18/12': '150%',
				'screen-xl': '1280px',
			},
			height: {
				'screen-xl': '720px',
			},
			borderWidth: {
				6: '6px',
				12: '12px',
			},
			blur: {
				'2xs': '1px',
				xs: '2px',
			},
		},
	},

	plugins: [],
};

module.exports = config;

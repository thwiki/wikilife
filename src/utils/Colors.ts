import colors from 'tailwindcss/colors';

export type ColorName = keyof typeof colors;
export type ColorShade = keyof (typeof colors)['red'];

export const ColorNamesAll = Object.keys(colors) as ColorName[];
export const ColorNamesShadable = [
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
] as ColorName[];

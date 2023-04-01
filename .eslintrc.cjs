module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking'],
	overrides: [
		{
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3',
			rules: {
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/restrict-plus-operands': 'off',
				'@typescript-eslint/restrict-template-expressions': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/require-await': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-misused-promises': 'off',
				'no-mixed-spaces-and-tabs': 'off',
				'no-constant-condition': 'off',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json', './tsconfig.node.json'],
		extraFileExtensions: ['.svelte'],
	},
	settings: {
		'svelte3/typescript': true,
	},
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['node_modules', 'scripts', '*.*.cjs', '*.js', '*.cjs'],
};

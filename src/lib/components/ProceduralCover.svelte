<script lang="ts">
	import type { CoverVariantName } from '@blocks/CoverBlock.svelte';
	import type { ColorName, ColorShade } from '@utils/Colors';
	import { forkSeed, fromSeed } from '@utils/Random';
	import colors from 'tailwindcss/colors';
	import ZText from './ZText.svelte';

	export let seed: number;
	export let size: string;
	export let bgColor: ColorName;
	export let fgColor: ColorName;
	export let color: ColorName;
	export let variant: CoverVariantName;

	let textLength = 0;
	let textSeed = 0;
	let textTop = 0;
	let textLeft = 0;
	let textRotate = 0;
	let blob1Top = 0;
	let blob1Left = 0;
	let blob2Top = 0;
	let blob2Left = 0;

	let realBgColor = '';
	let blob1Color = '';
	let blob2Color = '';
	let textColor = '';

	let blob1Path = '';
	let blob2Path = '';

	let amount = 0;
	let amount2 = 0;

	$: {
		const random = fromSeed(seed);

		textLength = random.int(3, 4) + random.int(1, 2);
		textSeed = forkSeed(random);

		textTop = 50 + random.int(-1, 1) * random.int(25, 35);
		textLeft = random.int(40, 60);
		textRotate = random.int(-2, 2) * 3;
		blob1Top = random.int(0, 100);
		blob1Left = random.int(0, 100);
		blob2Top = random.int(0, 100);
		blob2Left = random.int(0, 100);

		const bgLevel = random.choice(['100', '300', '700', '900'] as ColorShade[]);
		realBgColor = colors[bgColor][bgLevel];
		textColor = colors[color][bgLevel === '100' || bgLevel === '300' ? '800' : '200'];

		blob1Color = colors[fgColor][bgLevel];
		blob2Color = colors[fgColor][500];

		amount = random.int(0, 1);
		amount2 = random.int(0, 3);

		{
			const topSide = random.int(10, 40);
			const topOut = random.int(-25, 25);
			const rightSide = random.int(10, 40);
			const rightOut = random.int(-25, 25);
			const bottomSide = random.int(10, 40);
			const bottomOut = random.int(-25, 25);
			const leftSide = random.int(10, 40);
			const leftOut = random.int(-25, 25);

			blob1Path = `M 0 -50 C ${0 + topSide} ${-50 - topOut} ${50 + rightOut} ${0 - rightSide} 50 0 C ${50 - rightOut} ${0 + rightSide} ${
				0 + bottomSide
			} ${50 + bottomOut} 0 50 C ${0 - bottomSide} ${50 - bottomOut} ${-50 - leftOut} ${0 + leftSide} -50 0 C ${-50 + leftOut} ${
				0 - leftSide
			} ${0 - topSide} ${-50 + topOut} 0 -50 Z`;
		}

		{
			const topSide = random.int(10, 40);
			const topOut = random.int(-15, 15);
			const rightSide = random.int(10, 40);
			const rightOut = random.int(-15, 15);
			const bottomSide = random.int(10, 40);
			const bottomOut = random.int(-15, 15);
			const leftSide = random.int(10, 40);
			const leftOut = random.int(-15, 15);

			blob2Path = `M 0 -50 C ${0 + topSide} ${-50 - topOut} ${50 + rightOut} ${0 - rightSide} 50 0 C ${50 - rightOut} ${0 + rightSide} ${
				0 + bottomSide
			} ${50 + bottomOut} 0 50 C ${0 - bottomSide} ${50 - bottomOut} ${-50 - leftOut} ${0 + leftSide} -50 0 C ${-50 + leftOut} ${
				0 - leftSide
			} ${0 - topSide} ${-50 + topOut} 0 -50 Z`;
		}
	}
</script>

<div class="cover relative [contain:strict] overflow-hidden bg-gray-200 mx-auto pointer-events-none" style:height={size} style:width={size}>
	<div
		class="w-full h-full overflow-hidden {variant === 'tint' ? 'hue-rotate-30 brightness-90' : ''} {variant === 'rotate'
			? (amount === 0 ? '-rotate-3' : 'rotate-3') +
			  ' ' +
			  (amount2 === 0
					? 'origin-top-left'
					: amount2 === 1
					? 'origin-top-right'
					: amount2 === 2
					? 'origin-bottom-right'
					: 'origin-bottom-left')
			: ''} {variant === 'crop'
			? (amount === 0 ? '-translate-y-2' : 'translate-y-2') + ' ' + (amount2 <= 1 ? '-translate-x-2' : 'translate-x-2')
			: ''}"
		class:blur-xs={variant === 'blur'}
	>
		<svg class="w-full h-full" viewBox="0 0 100 100">
			<rect x="0" y="0" width="100" height="100" fill={realBgColor} />
			<path d={blob1Path} transform="translate({blob1Left} {blob1Top})" fill={blob1Color} />
			<path d={blob2Path} transform="translate({blob2Left} {blob2Top}) scale(0.75)" fill={blob2Color} />
			{#if variant !== 'textless'}
				<text
					text-anchor="middle"
					dominant-baseline="middle"
					transform="rotate({textRotate}, {textLeft}, {textTop})"
					font-size="20"
					x={textLeft}
					y={textTop}
					fill={textColor}
				>
					<ZText seed={textSeed} length={textLength} svg={true} />
				</text>
			{/if}
		</svg>
	</div>
	{#if variant === 'line'}
		<div class="absolute inset-0 opacity-50 {amount === 0 ? 'bg-stripes-x-gray' : 'bg-stripes-y-gray'}" />
	{/if}
</div>

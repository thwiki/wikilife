<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export type CellBlockCorner = [x: number, y: number];
	export type CellBlockCorners = [
		topLeft: CellBlockCorner,
		topRight: CellBlockCorner,
		bottomRight: CellBlockCorner,
		bottomLeft: CellBlockCorner,
	];

	export interface CellBlockModel {
		key?: string;
		type: 'cell';
		seed: number;
		color: ColorName;
		corners: CellBlockCorners;
		text: boolean;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import colors from 'tailwindcss/colors';
	import { fromSeed } from '../../utils/Random';

	let className: string = undefined;

	export { className as class };
	export let contentClass: string = undefined;

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName = undefined;
	export let corners: CellBlockCorners;
	export let text: boolean;
	export let draggable = false;

	let bgColor: string;
	let borderColor: string;

	let path: string;
	let top: number;
	let left: number;
	let bottom: number;
	let right: number;
	let height: number;
	let width: number;
	let textLeft: number;
	let textLengths: [offset: number, length: number][];

	$: {
		bgColor = (color ?? 'white') === 'white' ? colors['white'] : colors[color]['100'];
		borderColor = (color ?? 'white') === 'white' ? colors['slate']['200'] : colors[color]['300'];
	}

	const scaleY = Math.SQRT2;
	const insetX = 2;
	const insetY = 0.75;

	$: {
		const random = fromSeed(seed);

		top = Math.min(corners[0][1], corners[1][1]);
		left = Math.min(corners[0][0], corners[3][0]);
		bottom = Math.max(corners[2][1], corners[3][1]);
		right = Math.max(corners[1][0], corners[2][0]);
		height = bottom - top;
		width = right - left;

		const topLeft = [corners[0][0] + insetX, corners[0][1] + insetY];
		const topRight = [corners[1][0] - insetX, corners[1][1] + insetY];
		const bottomRight = [corners[2][0] - insetX, corners[2][1] - insetY];
		const bottomLeft = [corners[3][0] + insetX, corners[3][1] - insetY];

		path = 'M' + [topLeft, topRight, bottomRight, bottomLeft].map(([x, y]) => `${x - left},${(y - top) * scaleY}`).join(' L') + 'z';

		let leftDiff = topLeft[0] - bottomLeft[0];
		let rightDiff = topRight[0] - bottomRight[0];
		const isTextLeft = Math.abs(leftDiff) + 5 <= Math.abs(rightDiff);
		if (isTextLeft) {
			textLeft = Math.max(topLeft[0], bottomLeft[0]) + 4 - left;
		} else {
			textLeft = Math.min(topRight[0], bottomRight[0]) - 4 - left;
		}

		const minWidth = Math.min(topRight[0], bottomRight[0]) - Math.max(topLeft[0], bottomLeft[0]) - 4;

		textLengths = [];

		if (text) {
			let maxTextLength = height * scaleY - 10;

			const texts = Math.min(random.int(1, Math.floor(minWidth / 5)), 3);
			for (let index = 0; index < texts; index++) {
				const ratio = random.float(0.618, 0.9);
				if (random.float() < 0.25) {
					maxTextLength = height * scaleY - 10;
				}
				maxTextLength *= ratio;
				textLengths.push([isTextLeft ? (texts - 1 - index) * 4 : index * -4, maxTextLength]);
			}
		}
	}
</script>

<div
	class="cell_block pointer-events-none absolute {className ?? ''}"
	class:undraggable={!draggable}
	class:cursor-grab={draggable}
	style:top="{top}%"
	style:left="{left}%"
	style:width="{width}%"
	style:height="{height}%"
	data-key={key ?? `cell-${color}`}
>
	<svg class="pointer-events-none" viewBox="0 0 {width} {height * scaleY}">
		<path class="pointer-events-auto" fill={bgColor} stroke={borderColor} stroke-width="1.5" stroke-linejoin="round" d={path} />
		{#each textLengths as textLength}
			<path
				class={contentClass}
				stroke={borderColor}
				stroke-width="2"
				stroke-linecap="round"
				d="M{textLeft + textLength[0]},5 l0,{textLength[1]}"
			/>
		{/each}
	</svg>
</div>

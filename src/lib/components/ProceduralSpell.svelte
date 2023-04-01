<script lang="ts">
	import type { ColorName } from '@utils/Colors';
	import { forkSeed, fromSeed, pickDarkShade, pickLightShade, pickShadableColor } from '@utils/Random';
	import colors from 'tailwindcss/colors';
	import ZText from './ZText.svelte';

	export let seed: number;
	export let size: string = undefined;
	export let frame = 0;

	const width = 384;
	const height = 448;

	let second = 60;

	let bgColor: string;
	let fgColor: string;
	let bossColor: string;
	let bulletColor: string;

	let textength = 0;
	let textSeed = 0;

	let bossTop = 0;
	let bossLeft = 0;

	let fgPath = '';

	let bullets: {
		x: number;
		y: number;
	}[] = [];

	$: second = Math.max(60 - Math.floor(frame), 0);
	$: {
		const random = fromSeed(seed);

		bgColor = colors[pickShadableColor(random)][pickDarkShade(random)];
		fgColor = colors[pickShadableColor(random)][pickLightShade(random)];
		bossColor = colors[pickShadableColor(random)][pickLightShade(random)];
		bulletColor = colors[random.choice(['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple']) as ColorName]['500'];

		textength = random.int(2, 4) + random.int(2, 4) + random.int(1, 2);
		textSeed = forkSeed(random);

		bossTop = Math.round(height * random.float(0.2, 0.4));
		bossLeft = Math.round(width * random.float(0.2, 0.8));

		const ways = random.choice([8, 12, 16]);
		const interval = 5 * ways;
		const layers = (2 * height) / interval;
		const spin = random.choice([360, 480, -360, -480]) / ways / (2 * Math.PI);
		const baseDistance = 40;
		const margin = 30;

		const lerp = (start: number, end: number, t: number) => Math.round((1 - t) * start + t * end);

		const waveMid = { x: width / 2, y: Math.round(height * random.float(0.5, 0.9)) };
		const waveStart = { x: 0, y: waveMid.y + Math.round(height * random.float(-0.1, 0.1)) };
		const waveEnd = { x: width, y: waveMid.y + Math.round(height * random.float(-0.1, 0.1)) };
		const waveControls = [
			Math.round(height * random.float(-0.2, 0.2)),
			Math.round(height * random.float(-0.4, 0.4)),
			Math.round(height * random.float(-0.2, 0.2)),
		];

		const cycle = 20;
		fgPath = `M${waveStart.x},${waveStart.y}C${lerp(waveStart.x, waveMid.x, 0.5)},${
			waveStart.y + lerp(waveControls[0], -waveControls[0], (frame % cycle) / cycle)
		},${lerp(waveStart.x, waveMid.x, 0.5)},${waveMid.y + lerp(waveControls[1], -waveControls[1], (frame % cycle) / cycle)},${waveMid.x},${
			waveMid.y
		}C${lerp(waveMid.x, waveEnd.x, 0.5)},${waveMid.y - lerp(waveControls[1], -waveControls[1], (frame % cycle) / cycle)},${lerp(
			waveMid.x,
			waveEnd.x,
			0.5,
		)},${waveEnd.y + lerp(waveControls[2], -waveControls[2], (frame % cycle) / cycle)},${waveEnd.x},${waveEnd.y}L${width},${
			height + 1
		}L${0},${height}z`;

		bullets = [];

		for (let layer = 0; layer < layers; layer++) {
			const distance = baseDistance + (layer / 2) * interval;
			for (let way = 0; way < ways; way++) {
				const angle = (2 * Math.PI * way) / ways + (layer / 2 - frame) * spin;
				const x = Math.round(distance * Math.cos(angle) + bossLeft);
				const y = Math.round(distance * Math.sin(angle) + bossTop);
				if (x > -margin && x < width + margin && y > -margin && y < height + margin) {
					bullets.push({ x, y });
				}
			}
		}
	}
</script>

<div class="spell mx-auto relative" style:width={size}>
	<svg viewBox="0 0 {width} {height}" class="pointer-events-none">
		<rect x="0" y="0" {width} {height} fill={bgColor} />
		<path d={fgPath} fill={fgColor} />
		<g transform="translate({bossLeft} {bossTop - 16})">
			<circle r="10" fill={bossColor} />
			<path d="M0 -10 10 32C12 38 6 42 0 42-6 42-12 38-10 32Z" fill={bossColor} />
		</g>
		<g>
			{#each bullets as bullet}
				<circle r="10" cx={bullet.x} cy={bullet.y} fill={bulletColor} stroke-width="2" stroke="#fff" />
			{/each}
		</g>
		<text x={width - 12} y="40" text-anchor="end" font-size="24px" fill="#fff" stroke="#000" stroke-width="2">
			<ZText seed={textSeed} length={textength} svg={true} />
		</text>
		<rect x={width / 3} y="44" width={(width * 2) / 3} height="2" fill="#fc6464" />
		<text
			x={width - 2}
			y="20"
			text-anchor="end"
			font-size="24"
			fill="#fff"
			stroke="#000"
			stroke-width="4"
			font-weight="bold"
			paint-order="stroke"
			lang="zh">{second}</text
		>
	</svg>
</div>

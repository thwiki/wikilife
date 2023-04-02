<script lang="ts">
	import { getContext } from 'svelte';
	import UilLineAlt from 'svelte-unicons/src/icons/UilLineAlt.svelte';
	import badgesPng from '../assets/images/badges.png';
	import gameBgAvif from '../assets/images/game-bg.avif';
	import gameBgJpg from '../assets/images/game-bg.jpg';
	import Display from '../components/Display.svelte';
	import LangText from '../components/LangText.svelte';
	import ZText from '../components/ZText.svelte';
	import { Levels, type AppState, type GameModel } from '../Game.svelte';
	import LevelPopup from '../popups/LevelPopup.svelte';
	import TaskList from '../TaskList.svelte';

	const { seed, username, score, level, maxScore, progress, modals, dirtyForce } = getContext<AppState>('state');
	const game = getContext<GameModel>('game');

	let oldLevel: number = null;
	let levelColor = '';

	if ($score === 0) {
		modals.update((p) => {
			p.push({ content: LevelPopup, props: { level: 0 } });
			return p;
		});
	}

	$: {
		const newLevel = $level;
		if (oldLevel != null && newLevel > oldLevel) {
			$dirtyForce = true;
			modals.update((p) => {
				p.push({ content: LevelPopup, props: { level: newLevel } });
				return p;
			});
		}
		oldLevel = newLevel;
	}

	$: levelColor = Levels[$level].color;
</script>

<div class="relative w-full h-full [contain:strict] overflow-hidden bg-black">
	<div class="absolute panel_status bg-blue-500 z-50 pl-4 pr-6 pt-4 rounded-br-3xl shadow-md">
		<div class="flex items-center mb-2">
			<div class="text-xl leading-none text-white font-sans whitespace-nowrap overflow-hidden text-ellipsis">
				{#if username}
					{username}
				{:else}
					<ZText {seed} length={5} />
				{/if}
			</div>
			<div
				class="ml-4 w-4 h-8 -my-2 bg-cover"
				style:background-image="url({badgesPng})"
				style:background-position-x="{64 - $level * 16}px"
			/>
			<div class="{levelColor} ml-2 rounded-full px-2 py-1 text-base leading-none text-slate-200 whitespace-nowrap">
				<LangText key="level{$level}" />
			</div>
		</div>
		<div class="flex items-center">
			<div class="text-lg ml-2">
				<LangText key="contribution" />
			</div>
			<div class="flex-grow ml-4">
				<div class="relative h-2 flex bg-slate-300 overflow-hidden">
					<div class={levelColor} style:width="{$progress * 100}%" />
					<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
				</div>
				<div class="flex items-center text-sm leading-none mt-1">{$score}<UilLineAlt size="1em" />{$maxScore}</div>
			</div>
		</div>
	</div>
	<div class="absolute panel_list bg-white z-40">
		<TaskList tasks={game.tasks} />
	</div>
	<div class="absolute panel_work bg-sky-300 z-10">
		<picture>
			<source class="pointer-events-none absolute inset-0 w-full" type="image/avif" srcset={gameBgAvif} width="960" height="720" />
			<img class="pointer-events-none absolute inset-0 w-full" src={gameBgJpg} alt="" width="960" height="720" />
		</picture>
		<div class="absolute panel_work-bg bg-slate-700 rounded-3xl pointer-events-none z-0" />
		<div class="absolute panel_work-display [contain:strict] rounded-xl z-10">
			<Display />
		</div>
	</div>
</div>

<style>
	.panel_status {
		top: 0;
		left: 0;
		height: 80px;
		width: 360px;
	}
	.panel_list {
		top: 80px;
		left: 0;
		height: 640px;
		width: 320px;
	}
	.panel_work {
		top: 0;
		left: 320px;
		height: 720px;
		width: 960px;
	}
	.panel_work-bg {
		top: 60px;
		left: 60px;
		height: 640px;
		width: 840px;
	}
	.panel_work-display {
		top: 80px;
		left: 80px;
		height: 600px;
		width: 800px;
	}
</style>

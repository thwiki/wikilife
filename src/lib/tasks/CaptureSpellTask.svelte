<script lang="ts" context="module">
	import { forkSeed, fromFork } from '@utils/Random';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class CaptureSpellTaskModel extends BaseTaskModel {
		readonly type = 'capture-spell';

		score = 8;

		editorKeys: number[] = [];
		correctKeys: string[] = [];
		correctFrames: number[] = [];
		spellSeed: number;

		generate() {
			const blockRandom = fromFork(this.random);

			const maxFrame = 20;
			const saveFrame = 1;
			const n = this.random.int(2, 3);

			this.correctFrames = [];

			for (let index = 0; index < n; index++) {
				this.correctFrames.push(
					this.random.int(Math.ceil((index * (maxFrame - saveFrame)) / n), Math.floor(((index + 1) * (maxFrame - saveFrame)) / n) - 1) +
						saveFrame,
				);
			}

			this.spellSeed = forkSeed(blockRandom);
			this.correctKeys = this.correctFrames.map((correctFrame) => `spell-${correctFrame}`);
		}

		check(responseKeys: string[]) {
			return responseKeys.sort().join('|') === this.correctKeys.sort().join('|');
		}
	}
</script>

<script lang="ts">
	import SpellBlock from '@blocks/SpellBlock.svelte';
	import CenterList from '@collections/CenterList.svelte';
	import EditorCollection from '@collections/EditorCollection.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import { onDestroy } from 'svelte';
	import UilCamera from 'svelte-unicons/src/icons/UilCamera.svelte';
	import UilUpload from 'svelte-unicons/src/icons/UilUpload.svelte';
	import { linear } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import Button from '../components/Button.svelte';

	export let task: CaptureSpellTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let list: HTMLElement = undefined;
	let spellList: HTMLElement = undefined;

	const frameTime = 100;
	const frameRate = 2;
	const progressLimit = 20;

	let frameTimeout: number;
	let frame = 0;

	const progress = tweened(0, {
		duration: frameTime,
		easing: linear,
	});

	let reset = 0;

	let getResponses: () => string[];

	function nextFrame() {
		clearTimeout(frameTimeout);
		frame = Math.round(10 * (frame + (frameRate * frameTime) / 1000)) / 10;

		if (Math.floor(frame) === 20) {
			progress.set(0, { duration: 0 });
			frame = 0;
		}

		if (task.submitted) return;
		frameTimeout = setTimeout(nextFrame, frameTime);
	}

	function capture() {
		if (task.submitted) return;
		if (list.children.length < task.correctFrames.length) {
			const spell = spellList.querySelector<HTMLElement>('.spell_block');
			spell.classList.add('shutter');
			list.appendChild(spell.cloneNode(true));
		}
	}

	$: {
		if (spellList) {
			const spell = spellList.querySelector<HTMLElement>('.spell_block');
			spell.addEventListener('transitionend', () => {
				spell.classList.remove('shutter');
			});

			progress.set(0, { duration: 0 });
			frame = 0;

			frameTimeout = setTimeout(nextFrame, frameTime);
		}
	}

	onDestroy(() => {
		clearTimeout(frameTimeout);
	});

	$: progress.set(frame + (frameRate * frameTime) / 1000);
</script>

<Desktop>
	<Window color="yellow">
		<div slot="title"><LangText key="upload-file" /></div>
		{#key reset}
			<EditorCollection
				bind:list
				class="grid grid-cols-2 !space-y-0 gap-2 auto-rows-max"
				items={task.items}
				keys={task.editorKeys}
				targetable={false}
				sortable={true}
				disabled={task.submitted}
				bind:getKeys={getResponses}
			/>
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey="upload"
			on:reset={() => reset++}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(getResponses()));
			}}
		>
			<UilUpload slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="indigo">
		<div slot="title"><LangText key="reference" /></div>
		{#key reset}
			<CenterList bind:list={spellList}>
				<div class="w-full mb-auto" on:click={capture}>
					<SpellBlock seed={task.spellSeed} {frame} draggable={true} />
				</div>
				<div class="w-full mb-auto mt-auto h-4 flex items-center relative rounded-full bg-yellow-300">
					{#each task.correctFrames as correctFrame}
						<div
							class="absolute h-full scale-x-125 bg-gradient-to-r from-yellow-300 via-red-500 to-yellow-300"
							style:left="{correctFrame * (100 / progressLimit)}%"
							style:width="{100 / progressLimit}%"
						>
							<UilCamera class="absolute bottom-full left-1/2 -translate-x-1/2 text-red-500" size="1em" />
						</div>
					{/each}
					<div
						class="absolute bg-slate-700 top-0 bottom-0 -my-2 w-[2px] -translate-x-1/2"
						style:left="{$progress * (100 / progressLimit)}%"
					/>
				</div>
			</CenterList>
		{/key}
		<div slot="footer" class="flex w-full h-full items-center">
			<Button color="green" class="ml-auto" on:click={capture}><UilCamera slot="prefix" size="1em" /><LangText key="capture" /></Button>
		</div>
	</Window>
</Desktop>

<style>
	:global(.center_list .spell_block .content) {
		position: relative;
		cursor: pointer;
	}
	:global(.center_list .spell_block .content::before),
	:global(.center_list .spell_block .content::after) {
		content: '';
		position: absolute;
		z-index: 50;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #000;
		opacity: 0;
		transform: scaleY(0);
		transition-property: transform, opacity;
		transition-duration: 0.05s;
		transition-timing-function: ease-in;
	}
	:global(.center_list .spell_block .content::before) {
		bottom: 50%;
		transform-origin: top;
	}
	:global(.center_list .spell_block .content::after) {
		top: 50%;
		transform-origin: bottom;
	}
	:global(.center_list .shutter.spell_block .content::before),
	:global(.center_list .shutter.spell_block .content::after) {
		opacity: 1;
		transform: scaleY(1);
	}
</style>

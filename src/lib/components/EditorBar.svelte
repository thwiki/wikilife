<script lang="ts">
	import { createEventDispatcher, type ComponentProps } from 'svelte';
	import { UilRedo, UilSave } from 'svelte-unicons';
	import Button from '../components/Button.svelte';
	import type { TaskModel } from '../tasks';
	import LangText from './LangText.svelte';

	export let task: TaskModel;

	export let resetColor: ComponentProps<Button>['color'] = undefined;
	export let saveColor: ComponentProps<Button>['color'] = undefined;
	export let resetKey: ComponentProps<LangText>['key'] = undefined;
	export let saveKey: ComponentProps<LangText>['key'] = undefined;

	const dispatch = createEventDispatcher();

	function onClickReset() {
		if (task.submitted) return;
		dispatch('reset');
	}

	function onClickSave() {
		if (task.submitted) return;
		dispatch('save');
	}
</script>

<div class="flex w-full items-center">
	<Button color={resetColor ?? 'amber'} on:click={onClickReset}>
		<div slot="prefix">
			{#if $$slots.resetIcon}
				<slot name="resetIcon" />
			{:else}
				<UilRedo size="1em" />
			{/if}
		</div>
		<LangText key={resetKey ?? 'reset'} /></Button
	>
	<Button color={saveColor ?? 'blue'} class="ml-auto" on:click={onClickSave}>
		<div slot="prefix">
			{#if $$slots.saveIcon}
				<slot name="saveIcon" />
			{:else}
				<UilSave size="1em" />
			{/if}
		</div>
		<LangText key={saveKey ?? 'save'} /></Button
	>
</div>

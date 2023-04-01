<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';
	import type { I18NKey, I18NLang } from '../i18n';

	export interface TextBlockModel {
		key?: string;
		type: 'text';
		color?: ColorName;
		text: I18NKey;
		lang?: I18NLang;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import LangText from '../components/LangText.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let color: ColorName = undefined;
	export let text: I18NKey;
	export let lang: I18NLang = undefined;
	export let draggable = false;
</script>

<Block
	class="text_block {className ?? ''}"
	key={key ?? `text-${color ?? 'white'}-${text ?? ''}`}
	{color}
	{draggable}
	contentClass="text-black leading-3"><LangText key={text} {lang} /></Block
>

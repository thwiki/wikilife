<script lang="ts">
	import { OnlineMode } from '../../utils/Env';
	import Logo from '../assets/images/logo.svg?component';
	import startBgAvif from '../assets/images/start-bg.avif';
	import startBgJpg from '../assets/images/start-bg.jpg';
	import LangText from '../components/LangText.svelte';
</script>

<div class="relative w-full h-full [contain:strict] overflow-hidden bg-black">
	<picture>
		<source class="pointer-events-none absolute inset-0" type="image/avif" srcset={startBgAvif} width="1280" height="720" />
		<img class="pointer-events-none absolute inset-0" src={startBgJpg} alt="" width="1280" height="720" />
	</picture>
	<div class="pointer-events-none logo">
		<Logo class="absolute inset-0" />
	</div>
	{#if OnlineMode}
		<a href="https://cache.thwiki.cc{window.location?.pathname ?? ''}">
			<div class="absolute top-[405px] left-[200px] w-[234px] h-[195px] hover:bg-blue-500/50">
				<div class="absolute text-4xl bottom-2 w-full text-center"><LangText key="back-wiki" /></div>
			</div>
		</a>
	{/if}
	<slot />
</div>

<style>
	@keyframes bounceInDown {
		from,
		60%,
		75%,
		90%,
		to {
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}

		0% {
			opacity: 0;
			transform: translate3d(0, -3000px, 0) scaleY(3);
		}

		60% {
			opacity: 1;
			transform: translate3d(0, 25px, 0) scaleY(0.9);
		}

		75% {
			transform: translate3d(0, -10px, 0) scaleY(0.95);
		}

		90% {
			transform: translate3d(0, 5px, 0) scaleY(0.985);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}
	@keyframes bounceInRight {
		from,
		60%,
		75%,
		90%,
		to {
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}

		from {
			opacity: 0;
			transform: translate3d(3000px, 0, 0) scaleX(3);
		}

		60% {
			opacity: 1;
			transform: translate3d(-25px, 0, 0) scaleX(1);
		}

		75% {
			transform: translate3d(10px, 0, 0) scaleX(0.98);
		}

		90% {
			transform: translate3d(-5px, 0, 0) scaleX(0.995);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}

	:global(#zh-wiki),
	:global(#en-wiki) {
		animation-name: bounceInDown;
		animation-duration: 500ms;
		animation-delay: 100ms;
		animation-iteration-count: 1;
		animation-fill-mode: both;
	}
	:global(#zh-simulator),
	:global(#en-simulator) {
		animation-name: bounceInRight;
		animation-duration: 500ms;
		animation-delay: 300ms;
		animation-iteration-count: 1;
		animation-fill-mode: both;
	}
</style>

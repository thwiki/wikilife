import CellBlock from '@blocks/CellBlock.svelte';
import ChangeBlock from '@blocks/ChangeBlock.svelte';
import CommentBlock from '@blocks/CommentBlock.svelte';
import CoverBlock from '@blocks/CoverBlock.svelte';
import InfoBlock from '@blocks/InfoBlock.svelte';
import SpellBlock from '@blocks/SpellBlock.svelte';
import TalkBlock from '@blocks/TalkBlock.svelte';
import TextBlock from '@blocks/TextBlock.svelte';
import TitleBlock from '@blocks/TitleBlock.svelte';
import UserBlock from '@blocks/UserBlock.svelte';

import type { CellBlockModel } from '@blocks/CellBlock.svelte';
import type { ChangeBlockModel } from '@blocks/ChangeBlock.svelte';
import type { CommentBlockModel } from '@blocks/CommentBlock.svelte';
import type { CoverBlockModel } from '@blocks/CoverBlock.svelte';
import type { InfoBlockModel } from '@blocks/InfoBlock.svelte';
import type { SpellBlockModel } from '@blocks/SpellBlock.svelte';
import type { TalkBlockModel } from '@blocks/TalkBlock.svelte';
import type { TextBlockModel } from '@blocks/TextBlock.svelte';
import type { TitleBlockModel } from '@blocks/TitleBlock.svelte';
import type { UserBlockModel } from '@blocks/UserBlock.svelte';

export const BlockComponentMap = {
	info: InfoBlock,
	text: TextBlock,
	title: TitleBlock,
	cover: CoverBlock,
	cell: CellBlock,
	comment: CommentBlock,
	spell: SpellBlock,
	user: UserBlock,
	change: ChangeBlock,
	talk: TalkBlock,
} as const;

export type BlockModel =
	| InfoBlockModel
	| TextBlockModel
	| TitleBlockModel
	| CoverBlockModel
	| CellBlockModel
	| CommentBlockModel
	| SpellBlockModel
	| UserBlockModel
	| ChangeBlockModel
	| TalkBlockModel;

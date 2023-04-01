import CaptureSpellTask, { CaptureSpellTaskModel } from './CaptureSpellTask.svelte';
import CloseTalkTask, { CloseTalkTaskModel } from './CloseTalkTask.svelte';
import CreatePageTask, { CreatePageTaskModel } from './CreatePageTask.svelte';
import DeleteCommentTask, { DeleteCommentTaskModel } from './DeleteCommentTask.svelte';
import DeleteProblemTask, { DeleteProblemTaskModel } from './DeleteProblemTask.svelte';
import FixCodeTask, { FixCodeTaskModel } from './FixCodeTask.svelte';
import FixOrderTask, { FixOrderTaskModel } from './FixOrderTask.svelte';
import InputMangaTask, { InputMangaTaskModel } from './InputMangaTask.svelte';
import PromoteUserTask, { PromoteUserTaskModel } from './PromoteUserTask.svelte';
import ReplyTalkTask, { ReplyTalkTaskModel } from './ReplyTalkTask.svelte';
import RunJobTask, { RunJobTaskModel } from './RunJobTask.svelte';
import UploadCoverTask, { UploadCoverTaskModel } from './UploadCoverTask.svelte';

export const TaskComponentMap = {
	'create-page': CreatePageTask,
	'upload-cover': UploadCoverTask,
	'fix-code': FixCodeTask,
	'fix-order': FixOrderTask,
	'input-manga': InputMangaTask,
	'reply-talk': ReplyTalkTask,
	'delete-comment': DeleteCommentTask,
	'capture-spell': CaptureSpellTask,
	'promote-user': PromoteUserTask,
	'delete-problem': DeleteProblemTask,
	'close-talk': CloseTalkTask,
	'run-job': RunJobTask,
} as const;

export const TaskModels = [
	CreatePageTaskModel,
	UploadCoverTaskModel,
	FixOrderTaskModel,
	FixCodeTaskModel,
	CaptureSpellTaskModel,
	InputMangaTaskModel,
	ReplyTalkTaskModel,
	DeleteProblemTaskModel,
	DeleteCommentTaskModel,
	CloseTalkTaskModel,
	RunJobTaskModel,
	PromoteUserTaskModel,
] as const;

export type TaskModel = (typeof TaskModels)[number]['prototype'];

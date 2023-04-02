import type { AppStateSaveDto } from '../../lib/LoadSave.svelte';

export interface StorageAdaptor {
	overwrite(oldSave: AppStateSaveDto, newSave: AppStateSaveDto): boolean;
	from(): Promise<unknown>;
	to(obj: unknown, force: boolean): Promise<boolean>;
	last(obj: unknown): boolean;
}

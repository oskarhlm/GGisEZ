import { writable, type Subscriber, type Writable, get } from 'svelte/store';

export type Snackbar = {
	message: string;
	timeout: number;
};

function createSnackbarQueue() {
	const { subscribe, set, update }: Writable<Snackbar[]> = writable([]);

	return {
		subscribe,
		set,
		addSnackbar: (message: string, timeout = 4000) =>
			update((snackbars) => [...snackbars, { message, timeout }])
	};
}

export const snackbars = createSnackbarQueue();

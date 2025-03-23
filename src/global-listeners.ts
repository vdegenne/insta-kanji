import {app} from './app-shell/app-shell.js';
import {getThemeStore} from './imports.js';
import {imgStore, store} from './store.js';

window.addEventListener('keydown', async (event: KeyboardEvent) => {
	// console.log(event)
	if (event.altKey || event.ctrlKey) {
		return;
	}

	const target = event.composedPath()[0] as Element;
	if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
		return;
	}

	switch (event.key) {
		case 'd':
			(await getThemeStore()).toggleMode();
			break;
	}
});

window.addEventListener('paste', (event: ClipboardEvent) => {
	const items = event.clipboardData?.items;
	if (!items) return;

	for (const item of items) {
		if (item.type.startsWith('image/')) {
			const file = item.getAsFile();
			if (!file) return;

			const reader = new FileReader();
			reader.onload = () => {
				imgStore.base64 = reader.result as string;
			};
			reader.readAsDataURL(file);
			break;
		}
	}
});

export {};

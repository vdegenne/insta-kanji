import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {saveDataToFile} from './utils.js';

const fonts = {
	japanese: ['Noto Sans JP', 'Noto Serif JP'],
	korean: ['Noto Sans KR', 'Hahmlet'],
} as const;

export const allFontNames = Object.values(fonts).flat();

type AvailableFont = (typeof allFontNames)[number];

@saveToLocalStorage('insta-kanji')
export class AppStore extends ReactiveController {
	@state() kanji = '';
	@state() header = '';
	@state() showHeader = false;
	@state() fontFamily: AvailableFont = 'Noto Sans JP';
	@state() fontSize = 12;
	@state() fontWeight = 400;
	@state() opacity = 1;
	@state() xOffset = 1;
	@state() footer = '';
	@state() showFooter = '';
	@state() prompt = '';
	@state() description = '';

	lineageToJSON = true;

	saveSession() {
		saveDataToFile(
			JSON.stringify({
				image: imgStore.base64,
				...(this.toJSON() as object),
			}),
			`${this.kanji ?? 'session'}.json`,
		);
	}
}
@saveToLocalStorage('insta-kanji:image')
export class ImageStore extends ReactiveController {
	@state() base64 = '';
}

export const store = new AppStore();
export const imgStore = new ImageStore();

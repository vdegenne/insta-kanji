import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';

@saveToLocalStorage('insta-kanji')
export class AppStore extends ReactiveController {
	@state() kanji = '';
	@state() showKanji = false;
	@state() fontSize = 12;
	@state() fontWeight = 400;
	@state() opacity = 1;
	@state() xOffset = 1;
	@state() onyomi = '';
}
@saveToLocalStorage('insta-kanji:image')
export class ImageStore extends ReactiveController {
	@state() base64 = '';
}

export const store = new AppStore();
export const imgStore = new ImageStore();

import {withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query, state} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {imgStore, store} from '../store.js';
import styles from './app-shell.css?inline';
import {FormBuilder} from '../forms/FormBuilder.js';
import {sleep} from '../utils.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

const F = new FormBuilder(store);

@customElement('app-shell')
@withStyles(styles)
@withController(store)
export class AppShell extends LitElement {
	@query('#kanji-container') kanjiContainer!: HTMLDivElement;
	@query('img') imgElement!: HTMLImageElement;

	@state() _saving = false;

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`
			<div>
				<div class="border border-white">
					<div
						id="kanji-container"
						class="flex justify-center items-center relative"
					>
						${store.showKanji
							? html`
									<div
										class="absolute top-0 left-0 z-10 bg-black text-6xl flex justify-center items-center text-white jp size-[90px] font-bold"
										style=""
									>
										${store.kanji}
									</div>
								`
							: null}
						<img src="${imgStore.base64}" class="absolute w-full h-full" />
						<span
							style="font-size:${store.fontSize}px;font-weight:${store.fontWeight};position:relative;top:${store.xOffset}px;opacity:${store.opacity}"
							>${store.kanji}</span
						>
						<span class="absolute bottom-0 right-2 font-bold p-3 text-4xl jp"
							>${store.onyomi}</span
						>
					</div>
				</div>
				<div class="p-6">
					<md-filled-button
						@click=${this.#save.bind(this)}
						?disabled=${this._saving}
					>
						<md-icon slot="icon">save</md-icon>
						Save</md-filled-button
					>
				</div>
			</div>

			<div class="flex flex-col gap-10 p-6 flex-1">
				${F.TEXTFIELD('kanji', 'kanji')}
				${F.SLIDER('size', 'fontSize', {
					max: 1000,
				})}
				${F.SLIDER('weight', 'fontWeight', {
					min: 200,
					max: 900,
				})}
				<div class="flex w-full">
					${F.SLIDER('offset', 'xOffset', {
						min: -500,
						max: 500,
					})}
					<md-filled-button @click=${() => (store.xOffset = 0)}
						>reset</md-filled-button
					>
				</div>
				${F.SLIDER('opacity', 'opacity', {
					min: 0,
					max: 1,
					step: 0.01,
				})}
				${F.SWITCH('Show character', 'showKanji')}
				${F.TEXTFIELD('Onyomi', 'onyomi')}
			</div>
		`;
	}

	async #save() {
		this._saving = true;
		await sleep(100);
		await this.updateComplete;
		await sleep(100);
		const canvas = await html2canvas(this.kanjiContainer);
		let link = document.createElement('a');
		link.href = canvas.toDataURL('image/jpeg', 1);
		link.download = `${store.kanji}.jpg`;
		link.click();
		this._saving = false;
	}
}

export const app = (window.app = new AppShell());

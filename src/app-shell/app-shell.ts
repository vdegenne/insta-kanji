import {withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {materialShellLoadingOff} from 'material-shell';
import {FormBuilder} from '../forms/FormBuilder.js';
import {allFontNames, imgStore, store} from '../store.js';
import {copyToClipboard, sleep} from '../utils.js';
import styles from './app-shell.css?inline';

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
@withController(imgStore)
export class AppShell extends LitElement {
	@query('#kanji-container') kanjiContainer!: HTMLDivElement;
	@query('img') imgElement!: HTMLImageElement;

	@state() _saving = false;

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`
			<div style="font-family:${store.fontFamily};max-width:642px;">
				<div class="border border-white">
					<div
						id="kanji-container"
						class="flex justify-center items-center relative"
					>
						<div id="texts" class="absolute inset-0 flex m-6 mx-8">
							<div
								id="header"
								class="top-0 font-bold text-7xl"
								?hidden=${!store.showHeader}
							>
								${unsafeHTML(
									(store.header || store.kanji)
										.split('/')
										.map((part) => `<div>${part}</div>`)
										.join(''),
								)}
							</div>
							<div
								id="footer"
								class="bottom-0 font-bold text-5xl"
								?hidden=${!store.showFooter}
							>
								${unsafeHTML(
									store.footer
										.split('/')
										.map((part) => `<div>${part}</div>`)
										.join(''),
								)}
							</div>
						</div>
						${store.showHeader && false
							? html`
									<div
										class="absolute top-0 left-0 right-0 z-10 flex items-center text-white jp font-bold text-6xl p-4 justify-between"
									>
										${store.header || store.kanji
											? unsafeHTML(
													(store.header || store.kanji)
														.split('/')
														.map((part) => `<div>${part}</div>`)
														.join(''),
												)
											: null}
									</div>
								`
							: null}
						${imgStore.base64
							? html`
									<img
										src="${imgStore.base64}"
										class="absolute w-full h-full"
									/>
								`
							: null}
						<span
							style="font-size:${store.fontSize}px;font-weight:${store.fontWeight};position:relative;top:${store.xOffset}px;opacity:${store.opacity}"
							>${store.kanji}</span
						>
					</div>
				</div>

				<div id="actions" class="p-6 flex flex-wrap gap-4">
					<md-filled-tonal-button
						@click=${() => this.#save('png')}
						?disabled=${this._saving}
					>
						<md-icon slot="icon">save</md-icon>
						Save PNG</md-filled-tonal-button
					>
					<md-filled-tonal-button
						@click=${() => this.#save('jpeg')}
						?disabled=${this._saving}
					>
						<md-icon slot="icon">save</md-icon>
						Save JPEG</md-filled-tonal-button
					>
					<md-filled-tonal-button @click=${() => store.saveSession()}>
						<md-icon slot="icon">save</md-icon>
						Save session</md-filled-tonal-button
					>
					<md-filled-tonal-button @click=${() => (imgStore.base64 = '')}>
						<md-icon slot="icon">delete</md-icon>Delete
						background</md-filled-tonal-button
					>

					<md-filled-tonal-button
						href="https://huggingface.co/spaces/AP123/IllusionDiffusion"
						target="_blank"
					>
						<md-icon slot="icon">open_in_new</md-icon>
						HuggingFace
					</md-filled-tonal-button>
				</div>
			</div>

			<div class="flex flex-col gap-10 p-6 flex-1">
				<div class="flex">
					${F.SWITCH('', 'showHeader')} ${F.TEXTFIELD('Header', 'header')}
				</div>
				${F.TEXTFIELD('Kanji', 'kanji', {style: 'outlined'})}
				${F.SLIDER('Size', 'fontSize', {
					max: 1000,
				})}
				<div class="flex w-full">
					${F.SLIDER('Offset', 'xOffset', {
						min: -100,
						max: 100,
					})}
					<md-filled-tonal-button @click=${() => (store.xOffset = 0)}
						>Reset</md-filled-tonal-button
					>
				</div>
				${F.SLIDER('Weight', 'fontWeight', {
					min: 200,
					max: 900,
				})}
				${F.SLIDER('Opacity', 'opacity', {
					min: 0,
					max: 1,
					step: 0.01,
				})}

				<div class="flex">
					${F.SWITCH('', 'showFooter')} ${F.TEXTFIELD('Footer', 'footer')}
				</div>
				${F.FILTER('Font', 'fontFamily', allFontNames, {
					behavior: 'only-one',
					elevated: true,
				})}
				${F.TEXTFIELD('Prompt', 'prompt')}
				<div class="flex flex-col">
					${F.TEXTAREA('Description', 'description', {rows: 6})}
					<md-filled-tonal-button
						@click=${() => {
							copyToClipboard(
								store.description +
									`\n\n #japanese #learnjapanese #kanji #learnkanji #nihongo #japan`,
							);
						}}
					>
						<md-icon slot="icon">content_copy</md-icon>
						copy
					</md-filled-tonal-button>
				</div>
			</div>
		`;
	}

	async #save(type: 'png' | 'jpeg') {
		this._saving = true;
		await sleep(100);
		await this.updateComplete;
		await sleep(100);
		const canvas = await html2canvas(this.kanjiContainer);
		let link = document.createElement('a');
		switch (type) {
			case 'png':
				link.href = canvas.toDataURL('image/png');
				link.download = `${store.kanji}.png`;
				break;
			case 'jpeg':
				link.href = canvas.toDataURL('image/jpeg', 1);
				link.download = `${store.kanji}.jpg`;
				break;
		}
		link.click();
		this._saving = false;
	}
}

export const app = (window.app = new AppShell());

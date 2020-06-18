import { initializeApis } from './apis/index.js';
import { preloadTemplates } from './preloadTemplates.js';
import { YoutubePlaylistImportApp  } from './display/YoutubePlaylistImportApp.js';
import './patches/index.js';

Hooks.on("init", async () =>
{
	await initializeApis();

	await preloadTemplates();
});

Hooks.on("renderPlaylistDirectory", (app, html, data) => {
	const importButton = $(`<button class="import-yt-playlist">${game.i18n.localize('music-assist.import-youtube-playlist')}</button>`);
	html.find(".directory-footer").append(importButton);
	importButton.click((ev) => {
		new YoutubePlaylistImportApp().render(true);
	});
});

import { initializeApis } from './apis/index.js';
import { preloadTemplates } from './preloadTemplates.js';
import { PlaylistImportForm  } from './display/PlaylistImportForm.js';
import './patches/index.js';

Hooks.on("init", async () =>
{
	await initializeApis();
	
	await preloadTemplates();
});

Hooks.on("renderPlaylistDirectory", (app, html, data) => {
	if (game.user.isGM) {
		const importButton = $(`<button class="import-yt-playlist"><i class="fab fa-youtube"></i>${game.i18n.localize('music-assist.import-yt-playlist-nav-text')}</button>`);
		html.find(".directory-footer").append(importButton);
		importButton.click((ev) => {
			new PlaylistImportForm().render(true);
		});	
	}
});

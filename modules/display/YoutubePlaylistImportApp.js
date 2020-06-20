import { YouTubePlaylistImportService } from '../apis/YouTubePlaylistImportService.js';

export class YouTubePlaylistImportApp extends FormApplication {
	constructor(object = {}, options = null) {
    super(object, options);
    this.importService = new YouTubePlaylistImportService();
    this.playlistItems = [];
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/music-assist/templates/import-youtube-playlist.html';
		options.title = game.i18n.localize('music-assist.import-yt-playlist-nav-text');
		
    return options;
  }

	activateListeners(html) {
    super.activateListeners(html);

    html.find('button[id="music-assist-yt-import-btn-import"]').click(() => {
      this._onImportPlaylist(html.find('input[id="music-assist-yt-import-url-text"]')[0].value);
    });
	}

	getData() {
    return {
        myVar: 'This is a test var'
    };
  }

  async _onImportPlaylist(playlistStr) {
    let key = this.importService.extractPlaylistKey(playlistStr);
    if (!key) {
      ui.notifications.error(game.i18n.localize('music-assist.import-yt-playlist-msg-invalidkey'));
      return;
    }

    this.playlistItems = await this.importService.getPlaylistInfo(key);

  }
}

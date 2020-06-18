export class YoutubePlaylistImportApp extends FormApplication {
	constructor(object = {}, options = null) {
    super(object, options);
  }

	activateListeners(html) {
  //Todo setup form listeners
	}

	static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/music-assist/templates/import-youtube-playlist.html';
		options.title = game.i18n.localize('music-assist.import-youtube-playlist');
		
    return options;
  }

	getData() {
    return {
        myVar: 'This is a test var'
    };
  }

}
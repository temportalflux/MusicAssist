import * as MusicStreaming from '../config.js'

export class StreamingServiceApi
{

	constructor(key)
	{
		this.key = key;
	}

	get allApiSettings()
	{
		return game.settings.get(MusicStreaming.name, 'streamingApis');
	}

	async modifySettings(modify)
	{
		const allSettings = this.allApiSettings;
		allSettings[this.key] = modify(allSettings[this.key]);
		await game.settings.set(MusicStreaming.name, 'streamingApis', allSettings);
	}

	initialize() {}

	async initSettings(settings)
	{
		settings[this.key] = { ready: false };
	}

	// Attaches a script such that it will be loaded asynchronously
	attachApi(source)
	{
		const apiLoadScript = document.createElement('script');
		apiLoadScript.src = source;
		$(document).find('head').append(apiLoadScript);
	}

	async markLoaded()
	{
		await this.modifySettings(settings => {
			settings.ready = true;
		});
		Hooks.call(`${MusicStreaming.name}:apiLoaded`, {
			api: this.key
		});
	}

}

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

	isReady()
	{
		return this.allApiSettings[this.key].ready;
	}

	getId() { return this.key; }

	initialize() {}

	async initSettings(settings)
	{
		settings[this.key] = { ready: false };
	}

	async modifySettings(modify)
	{
		const allSettings = this.allApiSettings;
		modify(allSettings[this.key]);
		await game.settings.set(MusicStreaming.name, 'streamingApis', allSettings);
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
		console.log(game.settings.get(MusicStreaming.name, 'streamingApis'));
		Hooks.call(`${MusicStreaming.name}:apiLoaded`, {
			api: this.key
		});
	}

	extractSourceIdFromUrl(url)
	{
		return undefined;
	}

	supportsUrl(url)
	{
		return this.extractSourceIdFromUrl(url) !== undefined;
	}

	findOrCreatePlayer(ownerId, audioId, sourceId)
	{
		return undefined;
	}

}

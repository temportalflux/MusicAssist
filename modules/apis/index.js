import * as MusicStreaming from '../config.js';
import { YouTubeApi } from './YouTubeApi.js'

export async function initializeApis()
{
	game.settings.register(MusicStreaming.name, "streamingApis", {
		name: "Music Streaming Apis",
		type: Object,
		default: {},
		config: false
	});

	const streamingSettings = {};//game.settings.get(MusicStreaming.name, 'streamingApis');
	game.musicStreaming = [
		new YouTubeApi(),
		//new SpotifyApi(),
		//new SoundCloudApi(),
	].reduce((apis, api) =>
	{
		api.initSettings(streamingSettings);
		apis[api.key] = api;
		return apis;
	}, {});
	await game.settings.set(MusicStreaming.name, 'streamingApis', streamingSettings);

	Object.values(game.musicStreaming).forEach(api =>
	{
		api.initialize();
	});

	game.getStreamingApi = getApi;
}

export function getApi(key)
{
	return game.musicStreaming[key];
}

import * as MusicStreaming from '../config.js';
import {StreamingServiceApi} from './StreamingServiceApi.js'

export class YouTubeApi extends StreamingServiceApi
{

	constructor()
	{
		super('youtube');
	}

	initialize()
	{
		window.onYouTubeIframeAPIReady = this.onYoutubeApiReady.bind(this);

		// Load the YouTube iFrame Player API code asynchronously
		MusicStreaming.log("Attaching YouTube API");
		this.attachApi("https://www.youtube.com/iframe_api");
	}

	async onYoutubeApiReady()
	{
		MusicStreaming.log("YouTubeApi ready");
		await this.markLoaded();

		/*
		const token = '[My Spotify Web API access token]';
		const player = new Spotify.Player({
			name: 'Web Playback SDK Quick Start Player',
			getOAuthToken: cb => { cb(token); }
		});

		// Error handling
		player.addListener('initialization_error', ({ message }) => { console.error(message); });
		player.addListener('authentication_error', ({ message }) => { console.error(message); });
		player.addListener('account_error', ({ message }) => { console.error(message); });
		player.addListener('playback_error', ({ message }) => { console.error(message); });

		// Playback status updates
		player.addListener('player_state_changed', state => { console.log(state); });

		// Ready
		player.addListener('ready', ({ device_id }) =>
		{
			console.log('Ready with Device ID', device_id);
		});

		// Not Ready
		player.addListener('not_ready', ({ device_id }) =>
		{
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		player.connect();
		//*/
	};

}

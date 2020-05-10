import * as MusicStreaming from '../config.js';
import { StreamingServiceApi } from './StreamingServiceApi.js'

export class SpotifyApi extends StreamingServiceApi
{

	constructor()
	{
		super('spotify');
		this.player = null;
	}

	initialize()
	{
		window.onSpotifyWebPlaybackSDKReady = this.onSpotifyPlaybackReady.bind(this);

		// Load the Spotify Player API code asynchronously
		MusicStreaming.log("Attaching SpotifyApi:Playback");
		this.attachApi("https://sdk.scdn.co/spotify-player.js");
	}

	async onSpotifyPlaybackReady()
	{
		MusicStreaming.log("SpotifyApi:Playback ready");
		await this.markLoaded();

		this.player = new Spotify.Player({
			name: MusicStreaming.name,
			getOAuthToken: this.getOAuthToken.bind(this),
			volume: 0.5
		});

		const success = await this.player.connect();

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
	}
	
	/*
	const id = this.player._options.id;
	console.log(id);
	const response = await fetch(
		`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
		method: 'PUT',
		body: JSON.stringify({ uris: [spotify_uri] }),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`
		},
	});
	console.log(response);
	//*/

	async getOAuthToken(callback)
	{
	}

}

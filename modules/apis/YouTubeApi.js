import * as MusicStreaming from '../config.js';
import {StreamingServiceApi} from './StreamingServiceApi.js'

export class YouTubeApi extends StreamingServiceApi
{

	constructor()
	{
		super('youtube');
		this.players = {};
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
	}

	setPlayerAt(playerId, player)
	{
		this.players[playerId] = player;
		console.log(this.players);
	}

	getPlayerAt(playerId)
	{
		return this.players[playerId];
	}

}

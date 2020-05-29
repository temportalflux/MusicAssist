import * as MusicStreaming from '../config.js';
import {StreamingServiceApi} from './StreamingServiceApi.js'
import { YouTubePlayer } from './YouTubePlayer.js';

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
	}

	getPlayerAt(playerId)
	{
		return this.players[playerId];
	}

	getSupportedUrlFormats()
	{
		return [
			// User Provided
			/^youtube\/([^\s&]{11})$/,
			// Long links, extracts video id
			/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^\s&]{11}).*/,
			// short links, extracts video id
			/https?:\/\/(?:www\.)?youtu\.be\/([^\s&]{11}).*/
		];
	}

	matchUrlAgainstSupported(url)
	{
		return url !== undefined ? this.getSupportedUrlFormats().map(r => url.trim().match(r)).find(match => match !== null) : undefined;
	}

	extractSourceIdFromUrl(url)
	{
		const regexMatch = this.matchUrlAgainstSupported(url);
		return regexMatch !== undefined && regexMatch !== null ? regexMatch[1] : undefined;
	}

	findOrCreatePlayer(ownerId, audioId, sourceId)
	{
		var player = this.getPlayerAt(`youtube-player-${ownerId}-${audioId}`);
		if (player === null || player === undefined)
		{
			player = new YouTubePlayer(ownerId, audioId, sourceId);
			// display: none;
			$('body').append(`<div style=""><div id="${player.playerId}"></div></div>`);
			//player.createPlayer();
		}
		return player;
	}

}

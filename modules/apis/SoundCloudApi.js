import * as MusicStreaming from '../config.js';
import {StreamingServiceApi} from './StreamingServiceApi.js'

const API_TIMEOUT_DURATION = 500; // 500ms <=> 0.5 seconds

/**
	SoundCloud is not currently accepting new developer clients.
	Since there is no way to control an iframe from outside of its scripts
	there is no current way to have control over audio that is played
	from a soundcloud track.
	The documentations mentions `SC.stream(trackId)`, but that
	requires the SDK to have initialized with a client id.
*/
export class SoundCloudApi extends StreamingServiceApi
{

	constructor()
	{
		super('soundcloud');
	}

	initialize()
	{
		// Load the SoundCloud API code asynchronously
		MusicStreaming.log("Attaching SoundCloud API");
		this.attachApi("https://connect.soundcloud.com/sdk/sdk-3.3.2.js");
		//this.attachApi("https://soundcloud.com/player/api.js");
		
		// SoundCloud has no callback that is executed on SDK/API load, so we will use a timeout method
		setTimeout(this.checkForApi.bind(this), API_TIMEOUT_DURATION);
	}

	async checkForApi()
	{
		if (typeof SC === 'undefined')
		{
			console.log("Failed to find sound cloud");
			setTimeout(this.checkForApi.bind(this), API_TIMEOUT_DURATION);
		}
		else
		{
			await this.onApiReady();
		}
	}

	async onApiReady()
	{
		MusicStreaming.log("SoundCloud API ready");
		await this.markLoaded();
	}

	async getHtmlWidget(trackUrl)
	{
		const response = await $.getJSON(
			`http://soundcloud.com/oembed.json?url=${trackUrl}`
		);
		return response.html;
	}
	
	async getTrackId(trackUrl)
	{
		return await this.getHtmlWidget(trackUrl).match(
			/.*api\.soundcloud\.com%2Ftracks%2F([0-9]*)&.*/
		)[1];
	}

}

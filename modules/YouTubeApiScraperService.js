import * as MusicStreaming from './config.js';

const PLAYLIST_MAX_SIZE = 200;

export class YouTubeApiScraperService {
	constructor() { }

	async scrapeVideoNames(player) {
		return new Promise(async (resolve) => {

			var videoMap = [];
			
			for (let i=0; i < player.getPlaylist().length; i++) {
				let data = player.getVideoData();
				videoMap.push({
					id: data.video_id,
					title: data.title
				});
				
				await this.getNextTrack(player);
			}

			resolve(videoMap);
		});
	}
	
	async getNextTrack(player) {
		return new Promise((resolve) => {
			player.addEventListener('onStateChange', event => {
				if (event.data == -1) {
				  event.target.removeEventListener('onStateChange');
				  resolve(event.data);
				}
			});

			player.nextVideo();
		});
	}
}

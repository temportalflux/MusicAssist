import * as MusicStreaming from './config.js';

const PLAYLIST_MAX_SIZE = 200;

export class YouTubeApiScraperService {
	constructor() { }

	async scrapeVideoNames(player) {
		return new Promise(async (resolve, reject) => {

			var videoMap = [];
			for (let i=0; i < player.getPlaylist().length; i++) {
				let data = player.getVideoData();
				videoMap.push({
					id: data.video_id,
					title: data.title
				});

				/*
				* player.nextVideo() can time out sometimes, not sure why. So here, we put a timeout on it and retry up to 3 times, otherwise we throw.
				* This could probably be more elegant. The promise race works really nicely though.
				*/
				for (let f = 0; f < 3; f++) {
					try {
						await this.getNextTrack(player);
						break;
					} catch(ex) {
						MusicStreaming.log('getNextTrack timed out, retrying...');
						if (f == 2) {
							reject(ex);
						}
					}
				}
			}

			resolve(videoMap);
		});
	}
	
	async getNextTrack(player) {
		let playNextVideo = new Promise((resolve) => {
			player.addEventListener('onStateChange', event => {
				if (event.data == -1) {
				  event.target.removeEventListener('onStateChange');
				  resolve(event.data);
				}
			});
			player.nextVideo();
		});

		let timeout = new Promise((resolve, reject) => {
			let id = setTimeout(() => {
				clearTimeout(id);
				reject('timed out');
			}, 1000);
		});

		return Promise.race([
			playNextVideo,
			timeout
		]);
	}
}

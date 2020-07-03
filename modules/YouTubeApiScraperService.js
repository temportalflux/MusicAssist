import * as MusicStreaming from './config.js';

const PLAYLIST_MAX_SIZE = 200;

export class YouTubeApiScraperService {
	constructor() { }

	async scrapeVideoNames(player) {
		return new Promise(async (resolve, reject) => {

			let videoMap = [];

			 /*
				* The player sometimes will do nothing (likely an API bug and onReady is being called too early) on the first track, not sure why. So here, we try three times to successfully get the right one before we start scraping. Otherwise we throw.
				* This could probably be more elegant. The promise race works really nicely though.
			 */
				for (let f = 0; f < 3; f++) {
					try {
						await this.getTrack(player, 0);
						break;
					} catch(ex) {
						MusicStreaming.log('getNextTrack timed out, retrying...');
						if (f == 2) {
							reject(ex);
						}
					}
				}

			for (let i=0; i < player.getPlaylist().length; i++) {

				await this.getTrack(player, i);

				let data = player.getVideoData();
				videoMap.push({
					id: data.video_id,
					title: data.title
				});

				
			}

			resolve(videoMap);
		});
	}
	
	async getTrack(player, idx) {
		let playNextVideo = new Promise((resolve) => {
			player.addEventListener('onStateChange', event => {
				if (event.data == -1) {
				  event.target.removeEventListener('onStateChange');
				  resolve(event.data);
				}
			});
			player.playVideoAt(idx);
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

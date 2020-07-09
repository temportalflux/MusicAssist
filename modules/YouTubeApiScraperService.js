import * as MusicStreaming from './config.js';

export class YouTubeApiScraperService {
	constructor() { }
	
	async scrapeVideoNames(player) {
		return new Promise(async (resolve, reject) => {
			
			if (!player.getPlaylist()) {
				reject('Invalid Playlist');
				return;
			}
			
			let scrapedTracks = [];
			
			/*
			* The player sometimes will do nothing (likely an API bug and onReady is being called too early) on the first track. So here, we try three times to successfully get the right one before we start scraping. Otherwise we throw.
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
						return;
					}
				}
			}
			
			for (let i=0; i < player.getPlaylist().length; i++) {
				
				await this.getTrack(player, i);
				
				let data = player.getVideoData();
				scrapedTracks.push({
					id: data.video_id,
					title: data.title
				});
			}
			
			resolve(scrapedTracks);
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

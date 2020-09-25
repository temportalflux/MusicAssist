import { getApi } from './index.js';
import * as MusicStreaming from '../config.js';
import { YouTubeApiScraperService } from '../YouTubeApiScraperService.js'


//private consts & funcs
const playerId = 'musicassist-playlist-player';
let player;

function createPlayer(playlistId) {
	if (player != null) {
		throw 'Player already exists';
	}
	$('body').append(`<div style=""><div id="${playerId}"></div></div>`);
	
	player = new YT.Player(playerId, {
		width: '480px',
		height: '270px',
		playerVars: {
			listType:'playlist',
			list: playlistId
		}
	});
}

function cleanupPlayer() {
	//Always clean up all traces of the player
	if (player != null) {
		player.destroy();
		player = null;
	}
	
	$(`#${playerId}`).parent().remove();
}

export class YouTubePlaylistImportService {
	constructor() { 
		this.youTubeApiScraperService = new YouTubeApiScraperService();
	}
	
	extractPlaylistKey(playlistString) {
		//YouTube url (any string with a list querystring var)
		//No reliable regex lookbehind for all browsers yet, so we'll just get the first capture group instead
		const urlRegEx = /list\=([a-zA-Z0-9_-]+)/
		//Plain playlist key
		const keyRegEx = /^[a-zA-Z0-9_-]+$/
		
		if (!playlistString || playlistString.length === 0) {
			return;
		}
		
		var matches = urlRegEx.exec(playlistString);
		if (matches) {
			return matches[1];
		} else {
			return playlistString.match(keyRegEx)[0];
		}
	}
	
	async getPlaylistInfo(playlistKey) {
		return new Promise((resolve, reject) => {
			
			if (playlistKey == null) {
				reject('Empty playlist key');
				return;
			}
			
			/*
			*This is not too elegant as the YouTubeApi/YouTubePlayer classes are quite tightly coupled with playing sounds for Foundry, which we're not interested in doing.
			*We can get around this somewhat by creating our own YT.Player and ignoring the YouTubePlayer class altogether
			*Will probably need refactoring later.
			*/
			let api = getApi('youtube');
			if (!api || !api.isReady()) {
				//this should never really happen. The API is created during Foundry init.
				MusicStreaming.log('Unable to extract playlist info - API not ready');
				reject('API not ready');
				return;
			}	
			
			try {
				createPlayer(playlistKey);
			} 
			catch (ex) {
				reject(ex);
				return;
			}
			
			player.addEventListener('onReady', async (event) => {
				try {
					var videos = await this.youTubeApiScraperService.scrapeVideoNames(event.target);
					resolve(videos);
				}
				catch (ex) {
					MusicStreaming.log('Error scraping youtube iframe: ' + ex);
					reject(ex);
				}
				finally {
					cleanupPlayer();
					return;
				}
			});
			
			player.addEventListener('onError', event => {
				MusicStreaming.log('YT Player errored with code: ' + event.data);
				reject('YT player error: ' + event.data);
				cleanupPlayer();
				return;
			});
		});
	}
	
	async createFoundryVTTPlaylist(playlistName, trackList, volume) {
		return new Promise(async (resolve, reject) => {
			if (!playlistName || Object.prototype.toString.call(playlistName) !== "[object String]") {
				reject('Enter playlist name');
			}
			
			try {
				let playlist = await Playlist.create({
					"name": playlistName,
					"shuffle": false
				});
				
				let realVolume = AudioHelper.inputToVolume(volume);
				let playlistSounds = [];
				//videos: Arr of {id, title}
				for (let i=0; i < trackList.length; i++) {
					playlistSounds.push({
						name: trackList[i].title,
						lvolume: volume,
						volume: realVolume,
						path: 'invalid.mp3',
						repeat: false,
						streamed: true,
						flags: {
							bIsStreamed: true,
							streamingApi: 'youtube',
							streamingId: trackList[i].id
						}
					});
				}
				
				await playlist.createEmbeddedEntity("PlaylistSound", playlistSounds);
				resolve();
			} catch (ex) {
				reject(ex);
			}
		});
	}
}

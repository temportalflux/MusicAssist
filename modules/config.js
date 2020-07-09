export const name = 'music-streaming';
//add templates here
export const templates = {
	importYoutubePlaylist: 'modules/music-assist/templates/import-youtube-playlist.html',
};
export function log(...args)
{
	console.log(`MusicStreaming |`, ...args);
};
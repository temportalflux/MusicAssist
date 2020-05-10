import {overrideFunc} from './patcher.js'
import {YouTubePlayer} from '../players/YouTubePlayer.js';

/**
 * Set up the Howl object by calling the core AudioHelper utility
 * @param {Object} sound    The PlaylistSound for which to create an audio object
 * @return {Object}         The created audio object
 * @private
 */
overrideFunc(Playlist.prototype, '_createAudio', function(super_createAudio, sound)
{
	if (!sound.flags.bStreaming)
	{
		super_createAudio.call(this, sound);
		return;
	}
	YouTubePlayer.findOrCreatePlayer(this.id, sound._id, sound.flags.url);
});

overrideFunc(Playlist.prototype, 'playSound', function(super_playSound, sound)
{
	if (!sound.flags.bStreaming)
	{
		super_playSound.call(this, sound);
		return;
	}

	const ytPlayer = YouTubePlayer.findOrCreatePlayer(this.id, sound._id, sound.flags.url);
	ytPlayer.ensureLoaded(sound.flags.url);
	ytPlayer.setLoop(sound.repeat);
	ytPlayer.setVolume(sound.volume * game.settings.get("core", "globalPlaylistVolume"));
	if (sound.playing)
	{
		ytPlayer.startPlaying();
	}
	else
	{
		ytPlayer.stopPlaying();
	}
});

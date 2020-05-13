import {overrideFunc} from './patcher.js'
import { getApi } from '../apis/index.js';

Playlist.prototype.findOrCreatePlayer = function(sound) {
	console.log(sound);
	if (sound.flags.bIsStreamed && sound.flags.streamingApi !== undefined)
	{
		return getApi(sound.flags.streamingApi).findOrCreatePlayer(
			this.id, sound._id, sound.flags.streamingId
		);
	}
	return null;
};

/**
 * Set up the Howl object by calling the core AudioHelper utility
 * @param {Object} sound    The PlaylistSound for which to create an audio object
 * @return {Object}         The created audio object
 * @private
 */
overrideFunc(Playlist.prototype, '_createAudio', function(super_createAudio, sound)
{
	if (!sound.flags.bIsStreamed)
	{
		super_createAudio.call(this, sound);
		return;
	}
	this.findOrCreatePlayer(sound);
});

overrideFunc(Playlist.prototype, 'playSound', function(super_playSound, sound)
{
	if (!sound.flags.bIsStreamed)
	{
		super_playSound.call(this, sound);
		return;
	}

	const ytPlayer = this.findOrCreatePlayer(sound);
	ytPlayer.ensureLoaded(sound.flags.streamingId);
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

overrideFunc(Playlist.prototype, '_onDeleteEmbeddedEntity', function(
	super_onDeleteEmbeddedEntity,
	embeddedName, child, options, userId
)
{
	super_onDeleteEmbeddedEntity.call(this, embeddedName, child, options, userId);
	if (child.flags.bIsStreamed)
	{
		this.findOrCreatePlayer(child).delete();
	}
});

import { overrideFunc } from './patcher.js';
import { applyStreamingSoundConfig } from './SoundConfig.js';

Hooks.on('renderPlaylistSoundConfig', (cfg, html, data) =>
{
	applyStreamingSoundConfig(html, data);
});

overrideFunc(PlaylistSoundConfig.prototype, '_updateObject', function(super_updateObject, evt, formData, etc)
{
	if (!game.user.isGM) throw "You do not have the ability to configure an AmbientSound object.";

	if (!formData.streamed)
	{
		super_updateObject.call(this, evt, formData, etc);
		return;
	}

	formData["volume"] = AudioHelper.inputToVolume(formData["lvolume"]);

	formData.path = 'invalid.mp3';
	formData.flags = {
		bIsStreamed: formData.streamed,
		streamingApi: $(evt.target).find('span[name="api"]').text(),
		streamingId: formData.url,
	};

	if (this.object._id)
	{
		formData["_id"] = this.object._id;
		this.playlist.updateEmbeddedEntity("PlaylistSound", formData, {});
	}
	else this.playlist.createEmbeddedEntity("PlaylistSound", formData, {});
});
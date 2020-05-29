import { overrideFunc } from './patcher.js';
import { getApi } from '../apis/index.js';

AmbientSound.prototype.findOrCreatePlayer = function() {
	if (this.data.flags.bIsStreamed && this.data.flags.streamingApi !== undefined)
	{
		return getApi(this.data.flags.streamingApi).findOrCreatePlayer(
			this.scene.id, this.id, this.data.flags.streamingId
		);
	}
	return undefined;
};

overrideFunc(AmbientSound.prototype, '_onCreate', function(
	super_onCreate
)
{
	super_onCreate.call(this);

	// Create the youtube player as well
	this.findOrCreatePlayer();
});

overrideFunc(AmbientSound.prototype, '_onUpdate', function(
	super_onUpdate, data
)
{
	super_onUpdate.call(this, data);
	const changed = new Set(Object.keys(data));
	// NOTE: If more APIs are ever added, its possible that if the streamingApi changes,
	// the player for the previous API will be left hanging
	if (this.data.flags.bIsStreamed && (
		changed.has('streamingApi') || changed.has('streamingId')
	))
	{
		this.findOrCreatePlayer().setSourceId(this.data.flags.streamingId);
	}
});

overrideFunc(AmbientSound.prototype, 'play', function(
	super_play,
	isAudible, volume
)
{
	if (!this.data.flags.bIsStreamed)
	{
		super_play.call(this, isAudible, volume);
		return;
	}

	const player = this.findOrCreatePlayer();
	player.setLoop(true);
	player.setVolume(
		isAudible ?
			(volume || this.data.volume)
			* game.settings.get("core", "globalAmbientVolume")
			: 0
	);
	player.startPlaying();
});

overrideFunc(AmbientSound.prototype, '_onDelete', function(
	super_onDelete
)
{
	super_onDelete.call(this);
	if (this.data.flags.bIsStreamed)
	{
		this.findOrCreatePlayer().delete();
	}
});



import { overrideFunc } from './patcher.js';
import {YouTubePlayer} from '../apis/YouTubePlayer.js';

AmbientSound.prototype.findOrCreatePlayer = function() {
	if (this.data.flags.bIsStreamed)
	{
		return YouTubePlayer.findOrCreatePlayer(
			this.scene.id, this.id, this.data.flags.url
		);
	}
	return null;
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
	if (this.data.flags.bIsStreamed && changed.has('url'))
	{
		this.findOrCreatePlayer().ensureLoaded(this.data.flags.url);
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



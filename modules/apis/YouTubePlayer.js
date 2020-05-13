export class YouTubePlayer
{

	static findPlayer(playerId)
	{
		return game.getStreamingApi('youtube').getPlayerAt(playerId);
	}

	static findPlayerByIds(playlistId, soundId)
	{
		return YouTubePlayer.findPlayer(`youtube-player-${playlistId}-${soundId}`);
	}

	static _onYTPlayerStateChange(playerId, evt)
	{
		YouTubePlayer.findPlayer(playerId).onYTPlayerStateChange(evt);
	}

	static _onYTPlayerReady(playerId, evt)
	{
		YouTubePlayer.findPlayer(playerId).onYTPlayerReady(evt);
	}

	static _onError(sourceId, evt)
	{
		if (evt.data === 2 && sourceId === '') { return; }
		var errorMessage = 'unknown';
		switch (evt.data)
		{
			case 2:
				errorMessage = 'Invalid ID value';
				break;
			case 5:
				errorMessage = 'Content is not supporte don HTML5 player';
				break;
			case 100:
				errorMessage = 'Video not found';
				break;
			case 101:
			case 150:
				errorMessage = 'Embedded player not supported by owner';
				break;
			default:
		}
		console.error('Error in youtube player', {
			code: evt.data,
			message: errorMessage,
			sourceId: sourceId,
		});
	}

	constructor(playlistId, soundId, sourceId)
	{
		this.playlistId = playlistId;
		this.soundId = soundId;
		this.player = null;
		this.size = {
			width: '128',
			height: '128',
		};
		this.volume = 0;
		this.videoId = sourceId;
		this.playOnVideoLoaded = false; // if the video is waiting to play as soon as it loads
		this.shouldLoop = false; // if the player should loop after having completed playing the video
		
		if (!this.api.isReady())
		{
			Hooks.on('music-streaming:apiLoaded', this.anApiLoaded.bind(this));
		}
		this.api.setPlayerAt(this.playerId, this);
	}

	get api()
	{
		return game.getStreamingApi('youtube');
	}

	get playerId()
	{
		return `youtube-player-${this.playlistId}-${this.soundId}`;
	}

	anApiLoaded({api})
	{
		if (api !== 'youtube') { return; }
		this.createPlayer();
	}

	createPlayer()
	{
		if (!this.api.isReady()) { return; }
		console.log('Creating YouTubePlayer', this.playerId, this.videoId);
		this.player = new YT.Player(this.playerId, {
			...this.size,
			videoId: this.videoId, // load by function
			events: {
				'onReady': YouTubePlayer._onYTPlayerReady.bind(null, this.playerId),
				'onStateChange': YouTubePlayer._onYTPlayerStateChange.bind(null, this.playerId),
				'onError': YouTubePlayer._onError.bind(null, this.videoId),
			},
		});
	}

	onYTPlayerStateChange(evt)
	{
		if (this.hasEnded() && this.shouldLoop)
		{
			this.startPlaying();
		}
	}

	ensureLoaded(sourceId)
	{
		if (!this.hasPlayer())
		{
			this.videoId = sourceId;
		}
		else if (this.videoId !== sourceId)
		{
			this.stopPlaying();
			this.loadVideoId(sourceId);
		}
	}

	loadVideoId(videoId)
	{
		this.videoId = videoId;
		this.player.cueVideoById(videoId);
	}

	// Happens on video load
	onYTPlayerReady(evt)
	{
		this.setVolume(this.volume);
		if (this.playOnVideoLoaded)
		{
			this.playOnVideoLoaded = false;
			this.startPlaying();
		}
	}

	hasPlayer()
	{
		return this.player !== null && this.player !== undefined;
	}

	canQueryState()
	{
		return this.hasPlayer() && typeof(this.player.getPlayerState) === 'function';
	}

	isLoaded()
	{
		// 3 = buffering
		return this.canQueryState() ? this.player.getPlayerState() !== 3 : false;
	}

	isPlaying()
	{
		return this.canQueryState() ? this.player.getPlayerState() === 1 : false;
	}

	hasEnded()
	{
		return this.canQueryState() ? this.player.getPlayerState() === 0 : false;
	}

	startPlaying()
	{
		var bAwaitingLoad = !this.hasPlayer() || !this.isLoaded();
		if (!bAwaitingLoad && !this.isPlaying())
		{
			this.player.playVideo();
		}
		else
		{
			this.playOnVideoLoaded = true;
		}
	}

	stopPlaying()
	{
		if (this.hasPlayer() && this.isPlaying())
		{
			this.player.stopVideo();
		}
	}

	setLoop(bLoop)
	{
		this.shouldLoop = bLoop;
	}

	setVolume(volume)
	{
		this.volume = volume;
		if (this.hasPlayer() && typeof(this.player.setVolume) === 'function')
		{
			this.player.setVolume(volume * 100);
		}
	}

	delete()
	{
		if (this.hasPlayer())
		{
			this.player.destroy();
			$(`#${this.playerId}`).parent().remove();
		}
	}

}
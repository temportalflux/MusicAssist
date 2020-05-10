export class YouTubePlayer
{

	static findOrCreatePlayer(playlistId, soundId, streamingUrl)
	{
		var player = YouTubePlayer.findPlayerByIds(playlistId, soundId);
		if (player == null)
		{
			player = new YouTubePlayer(playlistId, soundId, streamingUrl);
			$('body').append(`<div style="display: block;"><div id="${player.playerId}"></div></div>`);
			player.createPlayer();
		}
		return player;
	}

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

	static _onError(evt)
	{
		console.error('Error in youtube player', evt);
	}

	constructor(playlistId, soundId, streamingUrl)
	{
		this.playlistId = playlistId;
		this.soundId = soundId;
		this.player = null;
		this.size = {
			width: '0',
			height: '0',
		};
		this.videoId = this.parseVideoId(streamingUrl);
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

	parseVideoId(url)
	{
		if (url === undefined) { return ''; }
		const regexMatch = url.trim().match(/.*youtube\.com\/watch\?v=(.{11}).*/);
		return regexMatch !== null ? regexMatch[1] : null;
	}

	createPlayer()
	{
		if (!this.api.isReady()) { return; }
		console.log('Creating YouTubePlayer', this.playerId);
		this.player = new YT.Player(this.playerId, {
			...this.size,
			videoId: this.videoId, // load by function
			events: {
				'onReady': YouTubePlayer._onYTPlayerReady.bind(null, this.playerId),
				'onStateChange': YouTubePlayer._onYTPlayerStateChange.bind(null, this.playerId),
				'onError': YouTubePlayer._onError,
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

	ensureLoaded(url)
	{
		const urlVideoId = this.parseVideoId(url);
		if (!this.hasPlayer())
		{
			this.videoId = urlVideoId;
		}
		else if (this.videoId !== urlVideoId)
		{
			this.stopPlaying();
			this.loadVideoId(urlVideoId);
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
		if (this.playOnVideoLoaded)
		{
			this.playOnVideoLoaded = false;
			this.startPlaying();
		}
	}

	hasPlayer()
	{
		return this.player !== null;
	}

	isLoaded()
	{
		// 3 = buffering
		return this.hasPlayer() ? this.player.getPlayerState() !== 3 : false;
	}

	isPlaying()
	{
		return this.hasPlayer() ? this.player.getPlayerState() === 1 : false;
	}

	hasEnded()
	{
		return this.hasPlayer() ? this.player.getPlayerState() === 0 : false;
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
		if (this.hasPlayer())
		{
			this.player.setVolume(volume * 100);
		}
	}

}
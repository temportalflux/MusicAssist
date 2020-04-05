
/**
 * The StreamingPlaylist Entity.
 * Each StreamingPlaylist is a collection of Sounds which are used to provide background music and sound effects.
 * Where the normal Playlist Entity uses audio from the server/hosts computer, this playlist
 * streams audio from a provider like YouTube or Spotify.
 * @extends {Entity}
 */
class StreamingPlaylist extends Entity
{

	constructor(...args)
	{
		super(...args);

    /**
     * Each sound which is played within the Playlist has a created Howl instance.
     * The keys of this object are the sound IDs and the values are the Howl instances.
     * @type {Object}
     */
		//this.audio = this.audio || {};

    /**
     * Playlists may have a playback order which defines the sequence of Playlist Sounds
     * @type {Array}
     */
		this.playbackOrder = [];

		// Spotify: ".*open.spotify.com/track/(.*)?.*" $1=trackId
		// YouTube:
		// - Parsing input: "https://www.youtube.com/watch?v=(.*)" $1=trackId
		// - Sample id: VkWRdaz7GKw
		// - Playing Audio: https://developers.google.com/youtube/player_parameters
		
		// SoundCloud: https://developers.soundcloud.com/docs/api
		/*
			https://soundcloud.com/steven-universeonsc/do-it-for-herhim?.*
			<iframe
				width="100%" height="300" scrolling="no" frameborder="no"
				allow="autoplay"
				src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/210624376&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false">
			</iframe>
		*/
	}

	/** @override */
	static get config()
	{
		return {
			baseEntity: StreamingPlaylist,
			collection: game.streamingPlaylists,
			embeddedEntities: { "StreamingSound": "sounds" }
		};
	}

	/** @override */
	prepareEmbeddedEntities()
	{
		//this.audio = {};
		this.data.sounds.forEach(s => this._createAudio(s));
	}

  /**
   * Set up the Howl object by calling the core AudioHelper utility
   * @param {Object} sound    The StreamingSound for which to create an audio object
   * @return {Object}         The created audio object
   * @private
   */
	_createAudio(sound)
	{
		/*
		let howl = game.audio.create({ src: sound.path });
		this.audio[sound._id] = {
			howl: howl,
			id: undefined,
			sound: sound._id
		};
		howl.on("end", () => this._onEnd(sound._id));

		// Handle sounds which are currently playing
		if (sound.playing)
		{
			if (Howler.state === "suspended") game.audio.pending.push(() => this.playSound(sound));
			else this.playSound(sound);
		}
		//*/
	}

  /**
   * This callback triggers whenever a sound concludes playback
   * Mark the concluded sound as no longer playing and possibly trigger playback for a subsequent sound depending on
   * the playlist mode.
   *
   * @param {string} soundId  The sound ID of the track which is ending playback
   * @private
   */
	async _onEnd(soundId)
	{
		if (!game.user.isGM) return;

		/*
		// Retrieve the sound object whose reference may have changed
		const sound = this.getEmbeddedEntity("StreamingSound", soundId);
		if (sound.repeat) return;

		// Conclude playback for the current sound
		const isPlaying = this.data.playing;
		await this.updateEmbeddedEntity("StreamingSound", { _id: sound._id, playing: false });

		// Sequential or shuffled playback -- begin playing the next sound
		if (isPlaying && [CONST.PLAYLIST_MODES.SEQUENTIAL, CONST.PLAYLIST_MODES.SHUFFLE].includes(this.mode))
		{
			let next = this._getNextSound(sound._id);
			if (next) await this.updateEmbeddedEntity("StreamingSound", { _id: next._id, playing: true });
			else await this.update({ playing: false });
		}

		// Simultaneous playback - check if all have finished
		else if (isPlaying && this.mode === CONST.PLAYLIST_MODES.SIMULTANEOUS)
		{
			let isComplete = !this.sounds.some(s => s.playing);
			if (isComplete)
			{
				await this.update({ playing: false });
			}
		}
		//*/
	}

  /**
   * Generate a new playback order for the playlist.
   * Use a seed for randomization to (hopefully) guarantee that all clients generate the same random order.
   * The seed is based on the first 9 characters of the UTC datetime multiplied by the index order of the playlist.
   * @private
   */
	/*
	_getPlaybackOrder()
	{
		const idx = this.collection.entities.findIndex(e => e._id === this.data._id);
		const seed = Number(new Date().getTime().toString().substr(0, 9)) * idx;
		const mt = new MersenneTwister(seed);

		// Draw a random order
		let shuffle = this.sounds.reduce((shuffle, s) =>
		{
			shuffle[s._id] = mt.random();
			return shuffle;
		}, {});

		// Return the playback order
		return this.sounds.map(s => s._id).sort((a, b) => shuffle[a] - shuffle[b]);
	}
	//*/

  /**
   * Get the next sound which should be played in the Playlist after the current sound completes
   * @param {string} soundId    The ID of the currently playing sound
   * @return {Object}           The sound data for the next sound to play
   * @private
   */
	/*
	_getNextSound(soundId)
	{

		// Get the playback order
		let order;
		if (this.mode === CONST.PLAYLIST_MODES.SHUFFLE)
		{
			if (!this.playbackOrder.length) this.playbackOrder = this._getPlaybackOrder();
			order = this.playbackOrder;
		} else order = this.sounds.map(s => s._id);

		// Cycle the playback index
		let idx = order.indexOf(soundId);
		if (idx === order.length - 1) idx = -1;

		// Return the next sound
		return this.getEmbeddedEntity("StreamingSound", order[idx + 1]);
	}
	//*/

  /**
   * An Array of the sound data contained within this Playlist entity
   * @type {Array}
   */
	get sounds()
	{
		return this.data.sounds;
	}

  /**
   * The playback mode for the Playlist instance
   * @type {Number}
   */
	get mode()
	{
		return this.data.mode;
	}

  /**
   * An indicator for whether any Sound within the Playlist is currently playing
   * @type {boolean}
   */
	get playing()
	{
		return this.sounds.some(s => s.playing);
	}

  /**
   * Play (or stop) a single sound from the Playlist
   * @param sound {Object}       The sound object to begin playback
   */
	playSound(sound)
	{
		/*
		// Get the audio data
		const audio = this.audio[sound._id];
		if (!sound.playing && !audio.id) return;

		// Start playing
		if (sound.playing)
		{
			if (audio.howl.state() !== "loaded") audio.howl.load();
			audio.id = audio.howl.play(audio.id);
			let vol = sound.volume * game.settings.get("core", "globalPlaylistVolume");
			audio.howl.volume(vol, audio.id);
			audio.howl.loop(sound.repeat, audio.id);
		}

		// End playback
		else audio.howl.stop(audio.id);
		//*/
	}

  /**
   * Begin simultaneous playback for all sounds in the Playlist
   * @return {Promise}    A Promise which resolves once the Playlist update is complete
   */
	async playAll()
	{
		// TODO: Only the GM should be allowed to do this
		const updateData = {};

		// Handle different playback modes
		switch (this.mode)
		{

			// Soundboard Only
			case CONST.PLAYLIST_MODES.DISABLED:
				updateData.playing = false;
				break;

			// Sequential Playback
			case CONST.PLAYLIST_MODES.SEQUENTIAL:
				updateData.sounds = duplicate(this.data.sounds).map((s, i) =>
				{
					s.playing = i === 0;
					return s;
				});
				updateData.playing = updateData.sounds.length > 0;
				break;

			// Simultaneous - play all tracks
			case CONST.PLAYLIST_MODES.SIMULTANEOUS:
				updateData.sounds = duplicate(this.data.sounds).map(s =>
				{
					s.playing = true;
					return s;
				});
				updateData.playing = updateData.sounds.length > 0;
				break;


			// Shuffle - play random track
			case CONST.PLAYLIST_MODES.SHUFFLE:
				// TODO: Shuffle the order of the sounds only if this is the GM
				/*
				this.playbackOrder = this._getPlaybackOrder();
				updateData.sounds = duplicate(this.data.sounds).map(s =>
				{
					s.playing = s._id === this.playbackOrder[0];
					return s;
				});
				updateData.playing = updateData.sounds.length > 0;
				//*/
				break;
		}

		// Update the Playlist
		return this.update(updateData);
	}

  /**
   * End playback for any/all currently playing sounds within the Playlist
   * @return {Promise}    A Promise which resolves once the Playlist update is complete
   */
	async stopAll()
	{
		const sounds = duplicate(this.data.sounds).map(s =>
		{
			s.playing = false;
			return s;
		});
		return this.update({ playing: false, sounds: sounds });
	}

  /**
   * Cycle the playlist mode
   * @return {Promise.<Playlist>}   A promise which resolves to the updated Playlist instance
   */
	async cycleMode()
	{

		// Cycle the playback mode
		const modes = Object.values(CONST.PLAYLIST_MODES);
		let mode = this.mode + 1;
		mode = mode > Math.max(...modes) ? modes[0] : mode;

		// Stop current playback
		let sounds = this.data.sounds.map(s =>
		{
			s.playing = false;
			return s;
		});

		// Update the playlist
		return this.update({ sounds: sounds, mode: mode });
	}

	/** @override */
	_onUpdate(response)
	{
		// Modify playback for individual sounds
		this.sounds.forEach(s => this.playSound(s));
		return super._onUpdate(response);
	}

	/** @override */
	_onCreateEmbeddedEntity(response)
	{
		// Create the audio object
		const sound = response.created;
		this._createAudio(sound);
		return super._onCreateEmbeddedEntity(response);
	}

	/** @override */
	_onUpdateEmbeddedEntity(response)
	{
		const changed = Object.keys(response.data);
		const sound = this.getEmbeddedEntity("StreamingSound", response.data._id);

		// TODO: Streaming sounds have a url, not a path
		// If the path was changed, we need to re-create the audio object
		/*
		if (changed.includes("path"))
		{
			const audio = this.audio[sound._id];
			audio.howl.stop(audio.id);
			this._createAudio(sound);
		}
		//*/
		// Otherwise update the playing state
		//else this.playSound(sound);
		
		return super._onUpdateEmbeddedEntity(response);
	}

	/** @override */
	_onDeleteEmbeddedEntity(response)
	{
		const sound = response.deleted;
		sound.playing = false;
		this.playSound(sound);
		//delete this.audio[sound._id];
		return super._onDeleteEmbeddedEntity(response);
	}

	/** @override */
	_onModifyEmbeddedEntity(response)
	{
		this.collection.render();
	}

}
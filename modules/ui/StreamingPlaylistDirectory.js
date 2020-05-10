import * as MusicStreaming from '../config.js';
import { ImportTrackForm } from '../ImportTrackForm.js';
import { YouTubeApi } from '../apis/YouTubeApi.js';
import { YouTubePlayer } from '../players/YouTubePlayer.js';

export default class StreamingPlaylistDirectory
{

	static link_render()
	{
		/*
		Hooks.on('renderSidebarTab', (sidebarCategory, html, _) =>
		{
			if (sidebarCategory.tabName !== 'playlists') { return; }
			this.render(sidebarCategory, html);
		});
		//*/

		Hooks.on('renderPlaylistDirectory', (playlistDir, html, data) =>
		{
			if (game.user.isGM)
			{
				this.renderImportTrack(playlistDir, html, data);
				this.renderTrackUi(playlistDir, html, data);
			}
		});
	}

	static render(sidebarCategory, html)
	{
		html.find('.directory-footer').after(`<div id="streaming"></div>`);

		const container = html.find('#streaming');
		container.append(
			`<header class="playlist-header flexrow" style="padding: 8px; flex: 0 0 100%; justify-content: space-between;">
			<h4 style="max-width: 180px;">
				<i class="fas fa-cloud-download-alt" />
				Streaming Playlists
			</h4>
			<div class="flexrow" style="flex-basis: 40px; justify-content: flex-end; flex: 0 0 15px;">
				<a class="sound-control" data-action="streaming-playlist-add" title="Add Playlist">
					<i class="fas fa-plus" />
				</a>
			</div>
		</header>`,
			`<ol class="directory-list" id="streaming-list"></ol>`
		);
		const addPlaylistAction = container.find(`[data-action="streaming-playlist-add"]`);
		MusicStreaming.log(container, addPlaylistAction);

		addPlaylistAction.on("click", event =>
		{
			MusicStreaming.log('Add Playlist', event.target);

			const isApiAvailable = (api) =>
			{
				const streamingApis = game.settings.get(MusicStreaming.name, 'streamingApis');
				return streamingApis[api] !== undefined && streamingApis[api].ready === true;
			};

			// If the youtube api exists and is ready (and ready is defined)
			if (isApiAvailable('youtube'))
			{
				/*
				var done = false;
				const youtubePlayer = new YT.Player(event.target, {
					height: '100',
					width: '200',
					videoId: 'VkWRdaz7GKw',
					autoplay: 0,
					controls: 0,
					events: {
						'onReady': event => {
							event.target.setVolume(50);
							event.target.playVideo();
						},
						'onStateChange': event => {
							console.log(event);
							if (event.data == YT.PlayerState.PLAYING && !done) {
								setTimeout(() => {
									youtubePlayer.stopVideo();
								}, 10 * 1000);
								done = true;
							}
						}
					}
				});
				//*/

				/*
				(async () =>
				{
					let playlist = await Playlist.create({
						name: `stream`,
						bStreamed: true,
					});
					MusicStreaming.log(playlist);
				})();
				//*/

			}

			//if (isApiAvailable('soundcloud'))
			//{
			//	const trackUrl = 'https://soundcloud.com/steven-universeonsc/do-it-for-herhim';
			//	//const player = await SC.oEmbed(trackUrl, { auto_play: false });
			//	//MusicStreaming.log(player);
			//	//player.play();
			//	//const player = SC.stream('steven-universeonsc/do-it-for-herhim');
			//	//MusicStreaming.log(player);
			//	const response = await $.getJSON(
			//		`http://soundcloud.com/oembed.json?url=${trackUrl}`
			//	);
			//	const iframeHtml = response.html;
			//	const trackIdMatcher = iframeHtml.match(/.*api\.soundcloud\.com%2Ftracks%2F([0-9]*)&.*/);
			//	const trackId = trackIdMatcher[1];
			//	console.log(trackId);
			//	event.target.after(response.html);
			//	//<iframe width="100%" height="166" scrolling="no" frameborder="no" src="http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F{trackId}{widgetParams}"></iframe>
			//}


		});
	}

	static renderImportTrack(playlistDir, html, _)
	{
		const playlistAddQuery = html.find('[data-action="playlist-add"]');
		// TODO: Localize text: ${game.i18n.localize("some-id")}
		const importTrackHtml =
			`<a class="sound-control" data-action="sound-import" title="Import Track">
			<i class="fas fa-download"></i>
		</a>`;
		// Add a button for each control row, right after the add action
		playlistAddQuery.after(importTrackHtml);
		const importTrackActions = html.find('[data-action="sound-import"]');

		if (importTrackActions.length === 0) return;

		// Increase the flex box of the parent to acccount for the new elements
		importTrackActions.closest(".playlist-controls").css("flex-basis", "110px");

		importTrackActions.on("click", event =>
		{
			const button = event.currentTarget;
			const buttonClass = button.getAttribute("class");
			if (buttonClass == null) return;
			const playlistDiv = button.closest(".entity");
			const playlistId = playlistDiv.getAttribute("data-entity-id");

			event.preventDefault();

			const playlist = game.playlists.get(playlistId);
			new ImportTrackForm(playlist, {}, {}).render(true);
		});
	}

	static renderTrackUi(playlistDir, html, data)
	{
		const playlists = data.entities;
		const playlistHtmls = html.find('ol.directory-list li.entity.playlist');
		playlistHtmls.each(function(i, playlistHtml) {
			const playlistId = $(this).data('entity-id');
			const playlist = playlists.find(playlist => playlist._id === playlistId);

			const playlistContents = $(this).find('ol.playlist-sounds li.sound');
			playlistContents.each(function(i, soundHtml) {
				const soundId = $(this).data('sound-id');
				const soundData = playlist.sounds.find(sound => sound._id === soundId);
				if (soundData.flags.bStreaming)
				{
					StreamingPlaylistDirectory.swapSoundEditAction(playlistId, soundId, $(this));
					YouTubePlayer.findOrCreatePlayer(playlistId, soundId);
				}
			});

		});
	}

	static swapSoundEditAction(playlistId, soundId, soundHtmlQuery)
	{
		const editActionLink_Old = soundHtmlQuery.find('div.sound-controls a.sound-control[data-action="sound-edit"]');
		
		const editTrackHtml =
			`<a class="sound-control" data-action="sound-edit-streaming" title="Edit Sound">
				<i class="fas fa-edit"></i>
			</a>`;
		editActionLink_Old.replaceWith(editTrackHtml);
		
		const editActionLink_New = soundHtmlQuery.find('[data-action="sound-edit-streaming"]');
		editActionLink_New.on("click", StreamingPlaylistDirectory.onEditSoundAction.bind(null, playlistId, soundId));
	}

	static onEditSoundAction(playlistId, soundId, event)
	{
		console.log(playlistId, soundId, event);
		event.preventDefault();
		const playlist = game.playlists.get(playlistId);
		const soundData = playlist.sounds.find(sound => sound._id === soundId);
		new ImportTrackForm(playlist, soundData, {}).render(true);
	}

}

StreamingPlaylistDirectory.link_render();
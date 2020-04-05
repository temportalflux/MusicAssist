import * as MusicStreaming from './config.js';

function modifyPropertyInt(html, propertyName, delta)
{
	const property = html.css(propertyName);
	let valueString = property.match(/[0-9]*/)[0];
	html.css(propertyName, `${parseInt(valueString) + delta}${property.slice(valueString.length)}`);
}

/*
Hooks.on('renderSidebar', (sidebar, html, _) =>
{
console.log(sidebar, html);

modifyPropertyInt(html, 'width', 34);

const findSidebarTab = (dataTabId) =>
{
	return html.find('nav#sidebar-tabs.tabs').find(`[data-tab='${dataTabId}']`);
};

const playlistTab = findSidebarTab('playlists');
console.log(playlistTab);
if (playlistTab === undefined) { return; }

const streamingPlaylistsTab =
	`<a class="item" title="Streaming Playlists" data-tab="streaming-playlists">
		<i class="fas fa-cloud-download-alt" />
	</a>`;
playlistTab.after(streamingPlaylistsTab);

});

Hooks.on('sidebarCollapse', (sidebar, bIsCollapsed) =>
{
if (bIsCollapsed)
{
	modifyPropertyInt($('div#sidebar'), 'height', 34);
}
else
{
	modifyPropertyInt($('div#sidebar'), 'width', 34);
}
});
//*/

Hooks.on('renderSidebarTab', (sidebarCategory, html, _) =>
{
	if (sidebarCategory.tabName !== 'playlists') { return; }

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

		const streamingApis = game.settings.get(MusicStreaming.name, 'streamingApis');
		// If the youtube api exists and is ready (and ready is defined)
		if (streamingApis.youtube !== undefined && streamingApis.youtube.ready === true)
		{
			const frame = container.find('iframe#test-youtube');
			MusicStreaming.log(frame);

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
						/*
						console.log(event);
						if (event.data == YT.PlayerState.PLAYING && !done) {
							setTimeout(() => {
								youtubePlayer.stopVideo();
							}, 10 * 1000);
							done = true;
						}
						//*/
					}
				}
			});
		}



	});
});

Hooks.on('renderPlaylistDirectory', (app, html, data) =>
{
	const playlistAddQuery = html.find('[data-action="playlist-add"]');
	// TODO: Localize text: ${game.i18n.localize("some-id")}
	const loopToggleHtml =
		`<a class="sound-control" data-action="sound-import" title="Import Track">
			<i class="fas fa-download"></i>
		</a>`;
	// Add a button for each control row, right after the add action
	playlistAddQuery.after(loopToggleHtml);
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
		MusicStreaming.log(playlistId, playlist);
		/*
		const newsounds = playlist.sounds.copy();
		newsounds.push({

		});
		playlist.update({
			sounds: newsounds
		});
		//*/
		// game.playlists.get("SToNyitUgfoS6570").createEmbeddedEntity("PlaylistSound", { name: "test", path: "test.mp3" })
		///*
		new ImportTrackForm({
			playlist: playlist,
			name: "",
			url: "",
			volume: 0.5,
			repeat: false,
		}).render(true);
		//*/
	});
});

Hooks.on('renderPlaylistSoundConfig', (soundConfig, html, _) =>
{
	//console.log(soundConfig);
});
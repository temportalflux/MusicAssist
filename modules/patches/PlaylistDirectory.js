import { ImportTrackForm } from '../ImportTrackForm.js';
import { YouTubePlayer } from '../apis/YouTubePlayer.js';

Hooks.on('renderPlaylistDirectory', (playlistDir, html, data) =>
{
	if (game.user.isGM)
	{
		renderImportTrack(html);
		renderTrackUi(html, data.entities);
	}
});

function renderImportTrack(html)
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

function renderTrackUi(html, playlists)
{
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
				swapSoundEditAction(playlistId, soundId, $(this));
				YouTubePlayer.findOrCreatePlayer(playlistId, soundId);
			}
		});

	});
}

function swapSoundEditAction(playlistId, soundId, soundHtmlQuery)
{
	const editActionLink_Old = soundHtmlQuery.find('div.sound-controls a.sound-control[data-action="sound-edit"]');
	
	const editTrackHtml =
		`<a class="sound-control" data-action="sound-edit-streaming" title="Edit Sound">
			<i class="fas fa-edit"></i>
		</a>`;
	editActionLink_Old.replaceWith(editTrackHtml);
	
	const editActionLink_New = soundHtmlQuery.find('[data-action="sound-edit-streaming"]');
	editActionLink_New.on("click", onEditSoundAction.bind(null, playlistId, soundId));
}

function onEditSoundAction(playlistId, soundId, event)
{
	console.log(playlistId, soundId, event);
	event.preventDefault();
	const playlist = game.playlists.get(playlistId);
	const soundData = playlist.sounds.find(sound => sound._id === soundId);
	new ImportTrackForm(playlist, soundData, {}).render(true);
}
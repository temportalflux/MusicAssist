Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    const importButton = $('<button  style="min-width: 96%; margin: 10px 6px;">TEST</button>');
    html.find('.directory-footer').append(importButton);
    importButton.click(ev => {
        GLOBAL_PLAYLIST_IMPORTER.playlistDirectoryInterface();
    });
});
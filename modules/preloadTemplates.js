export const preloadTemplates = async function() {
	const templatePaths = [
			'modules/music-assist/templates/import-youtube-playlist.html'
	];

	return loadTemplates(templatePaths);
}

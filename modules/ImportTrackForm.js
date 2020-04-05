import * as MusicStreaming from './config.js';

class ImportTrackForm extends FormApplication
{

	static get defaultOptions()
	{
		return mergeObject(super.defaultOptions, {
			title: `Playlist: Import Track`,
			template: `${MusicStreaming.templatePath}/importTrackForm.html`,
			width: 500
		});
	}

	getData()
	{
		return {
			playlistName: this.object.playlist.name,
			name: this.object.name,
			url: this.object.url,
			volume: this.object.volume,
			repeat: this.object.repeat ? 'checked' : '',
		};
	}

	activateListeners(html)
	{
		super.activateListeners(html);

		const onChange = (queryString, callback) =>
		{
			const query = html.find(queryString);
			if (query.length > 0)
			{
				query.on("change", callback);
			}
		};

		onChange("input[name='name']", event =>
		{
			this.object.name = event.target.value;
			this.render();
		});
		onChange("input[name='url']", event =>
		{
			this.object.url = event.target.value;
			this.render();
		});
		onChange("input[name='volume']", event =>
		{
			this.object.volume = event.target.value;
			this.render();
		});
		onChange("input[name='repeat']", event =>
		{
			this.object.repeat = event.target.checked;
			this.render();
		});
	}

	async _updateObject(event, {
		name, url, volume, repeat
	})
	{
		MusicStreaming.log(name, url, volume, repeat);
		const sound = await this.object.playlist.createEmbeddedEntity(
			"PlaylistSound", {
				name: name,
				path: "invalid.mp3",
				volume: volume,
				repeat: repeat,
				url: url,
			}, {}
		);
		MusicStreaming.log(sound);
	}

}
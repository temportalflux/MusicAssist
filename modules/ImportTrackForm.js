import * as MusicStreaming from './config.js';
import { htmlOnChange } from './patches/patcher.js';
import { getApi } from './apis/index.js';

export class ImportTrackForm extends FormApplication
{

	constructor(playlist, sound, options)
	{
		super(sound, options);
		this.playlist = playlist;
	}

	static get defaultOptions()
	{
		return mergeObject(super.defaultOptions, {
			title: `Playlist: Import Track`,
			template: `${MusicStreaming.templatePath}/importTrackForm.html`,
			width: 360
		});
	}

	/** @override */
	get title()
	{
		return `${this.playlist.name} Playlist: ${this.object.name || "New Track"}`;
	}

	/** @override */
	getData()
	{
		const data = duplicate(this.object);
		data.lvolume = AudioHelper.volumeToInput(data.volume);
		data.url = data.flags !== undefined ? data.flags.url : '';
		return data;
	}

	activateListeners(html)
	{
		super.activateListeners(html);

		htmlOnChange(html, "input[name='name']", event =>
		{
			this.object.name = event.target.value;
			this.render();
		});
		htmlOnChange(html, "input[name='url']", event =>
		{
			if (this.object.flags === undefined)
			{
				this.object.flags = {};
			}
			this.object.flags.url = event.target.value;
			this.render();
		});
		htmlOnChange(html, "input[name='volume']", event =>
		{
			this.object.volume = event.target.value;
			this.render();
		});
		htmlOnChange(html, "input[name='repeat']", event =>
		{
			this.object.repeat = event.target.checked;
			this.render();
		});
	}

	/** @override */
	async _updateObject(event, formData)
	{
		if (!game.user.isGM) throw "You do not have the ability to edit playlist sounds.";

		formData["volume"] = AudioHelper.inputToVolume(formData["lvolume"]);
		formData['path'] = 'invalid.mp3';
		formData['flags'] = {
			'streamingId': getApi('youtube').extractSourceIdFromUrl(formData['url']),
			'bIsStreamed': true,
		};

		if (this.object._id)
		{
			formData["_id"] = this.object._id;
			return this.playlist.updateEmbeddedEntity("PlaylistSound", formData, {});
		}
		return this.playlist.createEmbeddedEntity("PlaylistSound", formData, {});
	}

}
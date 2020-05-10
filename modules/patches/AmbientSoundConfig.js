import { findFormGroup, overrideFunc } from './patcher.js';

Hooks.on('renderAmbientSoundConfig', (cfg, html, data) =>
{
	// data.object
	const audioIsStreamed = (data.object.flags || {}).bIsStreamed || false;
	const audioStreamedUrl = (data.object.flags || {}).url || '';

	const form = html.find('form');
	const groupAudioSourcePath = findFormGroup(
		form, 'div.form-group', function(query)
		{
			return $(query).find('div.form-fields input[name="path"]').length > 0;
		}
	);

	groupAudioSourcePath.before(`
	<div class="form-group" id="group-streamed">
		<label>Is Streamed</label>
		<input type="checkbox" name="streamed" data-dtype="Boolean" ${audioIsStreamed ? 'checked' : ''} />
	</div>
	`);
	groupAudioSourcePath.after(`
	<div class="form-group" id="group-streamed-url">
		<label>
			Streamed Audio Url
			<span class="units">(youtube)</span>
		</label>
		<input type="text" name="url" data-dtype="Url" value="${audioStreamedUrl}" />
	</div>
	`);

	const inputIsStreamed = form.find('input[name="streamed"]');
	const groupStreamedUrl = form.find('div#group-streamed-url');
	const adjustVisibility = (bIsStreamed) => {
		groupAudioSourcePath.css('display', !bIsStreamed ? 'flex' : 'none');
		groupStreamedUrl.css('display', bIsStreamed ? 'flex' : 'none');
	};
	inputIsStreamed.on('change', evt => adjustVisibility(evt.target.checked));
	adjustVisibility(audioIsStreamed);

});

overrideFunc(AmbientSoundConfig.prototype, '_updateObject', function(super_updateObject, evt, formData)
{
	if (!game.user.isGM) throw "You do not have the ability to configure an AmbientSound object.";

	if (formData.streamed)
	{
		formData.path = 'invalid.mp3';
		formData.flags = {
			bIsStreamed: formData.streamed,
			url: formData.url,
		};
	}

	if ( this.object.id ) {
		formData["id"] = this.object.id;
		this.object.update(formData);
	}
	else this.object.constructor.create(formData);
});

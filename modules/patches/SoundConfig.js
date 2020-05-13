import { findFormGroup, overrideFunc } from './patcher.js';

export function applyStreamingSoundConfig(html, data)
{
	const audioIsStreamed = (data.flags || {}).bIsStreamed || false;
	const audioStreamedApi = (data.flags || {}).streamingApi || '';
	const audioStreamingId = (data.flags || {}).streamingId || '';

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
			<span class="units">(<span name="api">${audioStreamedApi}</span>)</span>
		</label>
		<input type="text" name="url" data-dtype="Url" value="${audioStreamingId}" />
	</div>
	`);

	const inputIsStreamed = form.find('input[name="streamed"]');
	const groupStreamedUrl = form.find('div#group-streamed-url');
	const inputStreamedUrl = form.find('input[name="url"]');
	const adjustVisibility = (bIsStreamed) => {
		groupAudioSourcePath.css('display', !bIsStreamed ? 'flex' : 'none');
		groupStreamedUrl.css('display', bIsStreamed ? 'flex' : 'none');
	};
	inputIsStreamed.on('change', evt => adjustVisibility(evt.target.checked));
	inputStreamedUrl.on('change', evt => {
		const api = Object.values(game.musicStreaming).find(api => api.supportsUrl(evt.target.value));
		inputStreamedUrl.val(api !== undefined ? api.extractSourceIdFromUrl(evt.target.value) : '');
		form.find('span[name="api"]').html(api !== undefined ? api.getId() : 'none');
	});
	adjustVisibility(audioIsStreamed);
}
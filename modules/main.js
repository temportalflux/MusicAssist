import * as MusicStreaming from './config.js'
import { initializeApis } from './apis/index.js'
import './patches/index.js';

Hooks.on("init", async () =>
{
	// TODO: Remove debug hooks in prod
	CONFIG.debug.hooks = true;

	await initializeApis();
});

MusicStreaming.log(`loaded`);

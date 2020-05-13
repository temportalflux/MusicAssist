import { initializeApis } from './apis/index.js'
import './patches/index.js';

Hooks.on("init", async () =>
{
	// TODO: remove for releases
	CONFIG.debug.hooks = true;
	await initializeApis();
});

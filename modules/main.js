import { initializeApis } from './apis/index.js'
import './patches/index.js';

Hooks.on("init", async () =>
{
	await initializeApis();
});

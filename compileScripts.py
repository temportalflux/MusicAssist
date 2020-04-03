import glob
import json
import os

scriptsDir = 'scripts/'
manifest = 'module.json'

globbedFiles = glob.glob('{}*.js'.format(scriptsDir), recursive=True)
scriptFiles = [x.replace('\\', '/') for x in globbedFiles]

with open(manifest, 'r+') as f:
	data = json.load(f)
	data['scripts'] = scriptFiles
	f.seek(0)
	json.dump(data, f, indent=4)
	f.truncate()

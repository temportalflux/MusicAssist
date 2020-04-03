import glob
import json
import os
import zipfile
import sys

print('Args: {}'.format(sys.argv))
isDebug = len(sys.argv) >= 2 and sys.argv[1] == 'debug'
debugVersion = sys.argv[2] if isDebug and len(sys.argv) >= 3 else ''

scriptsDir = 'scripts'
# TODO: Move this to a github release submission for non-development builds
packageDir = 'packages'
manifestFilepath = 'module.json'
manifest = {}

globbedFiles = glob.glob('{}/*.js'.format(scriptsDir), recursive=True)
scriptFiles = [x.replace('\\', '/') for x in globbedFiles]

with open(manifestFilepath, 'r+') as f:
	manifest = json.load(f)
	manifest['scripts'] = scriptFiles
	f.seek(0)
	json.dump(manifest, f, indent=2)
	f.truncate()

zipf = zipfile.ZipFile(
	'{}/{}_{}{}.zip'.format(
		packageDir, manifest['name'], manifest['version'],
		'b{}'.format(debugVersion) if isDebug else ''
	),
	'w', zipfile.ZIP_DEFLATED
)
zippedFiles = []
def zipdir(dirPath, indent):
	for subPath in os.listdir(dirPath):
		fullPath = os.path.join(dirPath, subPath)
		if os.path.isdir(fullPath):
			zipdir(fullPath, '{} '.format(indent))
		else:
			zippedFiles.append(fullPath)
			zipf.write(fullPath)
for subPath in manifest['packageItems']:
	fullPath = os.path.join('', subPath)
	if os.path.isdir(fullPath):
		zipdir(fullPath, '')
	else:
		zippedFiles.append(fullPath)
		zipf.write(fullPath)
zipf.close()
print(zippedFiles)

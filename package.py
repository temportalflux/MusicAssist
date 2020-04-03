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
debugPackageUrl = 'https://github.com/temportalflux/MusicAssist/blob/master/{filePath}?raw=true'

globbedFiles = glob.glob('{}/*.js'.format(scriptsDir), recursive=True)
scriptFiles = [x.replace('\\', '/') for x in globbedFiles]

packageFilePath = '{dir}/{name}_{version}{debugVer}.zip'

with open(manifestFilepath, 'r+') as f:
	manifest = json.load(f)
	manifest['scripts'] = scriptFiles
	packageFilePath = packageFilePath.format(
		dir = packageDir,
		name = manifest['name'],
		version = manifest['version'],
		debugVer = 'b{}'.format(debugVersion) if isDebug else ''
	)
	manifest['download'] = debugPackageUrl.format(filePath = packageFilePath)
	f.seek(0)
	json.dump(manifest, f, indent=2)
	f.truncate()

zipf = zipfile.ZipFile(packageFilePath, 'w', zipfile.ZIP_DEFLATED)
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




import glob
import json
import os
import zipfile
import sys
import shutil
from distutils.dir_util import copy_tree

# TODO: Move this to a github release submission for non-development builds
packageDir = 'builds'
manifestFilepath = 'module.json'
manifest = {}
debugPackageUrl = 'https://github.com/temportalflux/MusicAssist/blob/master/{filePath}?raw=true'

def collectFiles(rootDir, ext):
	return ['{}'.format(x.replace('\\', '/')) for x in glob.glob('{}/**/*.{}'.format(rootDir, ext), recursive=True)]
projectFiles = {
	'icons': '*',
	'styles': 'css',
	'templates': 'html',
}
for fileType in projectFiles:
	projectFiles[fileType] = collectFiles('./{}'.format(fileType), projectFiles[fileType])
	print('{}: {}'.format(fileType, projectFiles[fileType]))

packageFilePath = '{dir}/{name}_{version}.zip'

with open(manifestFilepath, 'r+') as f:
	manifest = json.load(f)
	for fileType in projectFiles:
		manifest[fileType] = projectFiles[fileType]
	packageFilePath = packageFilePath.format(
		dir = packageDir,
		name = manifest['name'],
		version = manifest['version'],
	)
	#manifest['download'] = debugPackageUrl.format(filePath = packageFilePath)
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

if 'debugBuildDirectory' in manifest and 'packageItems' in manifest:
	copyBuildFilesTo = os.path.join(manifest['debugBuildDirectory'], manifest['name'])
	shutil.rmtree(copyBuildFilesTo)
	for item in manifest['packageItems']:
		fullPath = os.path.join('', item)
		destPath = os.path.join(copyBuildFilesTo, item)
		print('Copying {} to {}'.format(fullPath, destPath))
		if os.path.isdir(fullPath):
			copy_tree(fullPath, destPath)
		else:
			shutil.copyfile(fullPath, destPath)


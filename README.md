# MusicAssist
---

* **Author**: temportalflux (discord: temportalflux#3142)
* **Version**: 0.1.0
* **Foundry VTT Compatibility**: 0.5.5+ (possibly older versions)
* **System Compatibility (If applicable)**: n/a
* **Module Requirement(s)**: n/a
* **Module Conflicts**: no known conflicts, but its plausible that any modules change the playlist or ambient sound data could conflict
* **Translation Support**: (Note which languages are supported, and if they have (full) or (partial) translations.

## Link(s) to Module
* https://github.com/temportalflux/MusicAssist
* https://raw.githubusercontent.com/temportalflux/MusicAssist/master/module.json

## Description
A module for FoundryVTT which adds support for youtube tracks in audio playlists. This allows users to grab their favorite youtube soundtracks and save them as tracks in FVTT. These tracks are played back on each user's computer according to the normal playlist controls. This does require an internet connection to work properly, as it streams the video and just plays the audio.

The current feature set includes:
- Playlist tracks can be imported from a youtube url such as `https://www.youtube.com/watch?v=_2xHCZSqpi4`
- Ambient Sound objects can be marked as streaming sounds with the same functionality as streamed playlist tracks (these are unable to fade however)

## Installation
Import the [module.json](https://raw.githubusercontent.com/temportalflux/MusicAssist/master/module.json) as you would any other module. The contents of the module directory should look similar to this github repository's root.

## Features

### Default Foundry
By default, Foundry's sound system has support for:
- Playlists
  - Tracks sepcified by file (`dawdle.mp3`), or by file url (`https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Impact/Kevin_MacLeod_-_01_-_Impact_Prelude.mp3`)
  - Looping
  - Volume
  - Play/Stop
- Ambient Sound (Location Based)
  - Tracks sepcified by file (`dawdle.mp3`), or by file url (`https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Impact/Kevin_MacLeod_-_01_-_Impact_Prelude.mp3`)
  - Distance (can hear only if within area)
  - Local (cannot hear through walls) vs Global (can hear through walls)
  - Falloff (easing makes the audio quieter the farther away a token is)
  - Volume

### New Features
This module adds onto the pre-existing sound system by expanding it to stream audio from [Supported Providers](<#Supported Providers>).

Playlist and Ambient Sound configurations have changed a bit in order to support streaming urls instead of just file url paths.

{ insert config images }

Streamed audio plays on each user's client without saving any downloaded information to your computer. If these url's cease to work, the sound will no longer be able to play. Playlist tracks which are streamed can exist alongside playlist tracks which are not.

Ambient Sounds which are streamed support all functionality of the non-streamed variants, with the exception that easing does not currently effect the audio volume when a user first enters the area.

## Supported Providers
The only currently supported source for streamed content is [YouTube](https://www.youtube.com/) (via their [iFrame Api](https://developers.google.com/youtube/iframe_api_reference)).
The explored possibnle providers are all logged in the [api support tickets](https://github.com/temportalflux/MusicAssist/issues?q=label%3Aapi). If a provider is not listed in there, please feel free to make a ticket with the `api-support` label!

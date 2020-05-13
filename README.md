## MusicAssist

* **Author**: temportalflux (discord: temportalflux#3142)
* **Version**: 0.1.0
* **Foundry VTT Compatibility**: 0.5.5+ (possibly older versions)
* **System Compatibility (If applicable)**: n/a
* **Module Requirement(s)**: n/a
* **Module Conflicts**: no known conflicts, but its plausible that any modules change the playlist or ambient sound data could conflict
* **Translation Support**: (Note which languages are supported, and if they have (full) or (partial) translations.

### Link(s) to Module
* https://github.com/temportalflux/MusicAssist
* https://raw.githubusercontent.com/temportalflux/MusicAssist/master/module.json

### Description
A module for FoundryVTT which adds support for youtube tracks in audio playlists. This allows users to grab their favorite youtube soundtracks and save them as tracks in FVTT. These tracks are played back on each user's computer according to the normal playlist controls. This does require an internet connection to work properly, as it streams the video and just plays the audio.

The current feature set includes:
- Playlist tracks can be imported from a youtube url such as `https://www.youtube.com/watch?v=_2xHCZSqpi4`
- Ambient Sound objects can be marked as streaming sounds with the same functionality as streamed playlist tracks (these are unable to fade however)

### Installation
Import the [module.json](https://raw.githubusercontent.com/temportalflux/MusicAssist/master/module.json) as you would any other module. The contents of the module directory should look similar to this github repository's root.

---

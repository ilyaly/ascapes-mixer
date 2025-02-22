# Ascape Mixer

![](./static/ascapes-mixer-preview.jpg)

## About

An audio player and mixer designed for TTRPG actual play, enabling control of music, ambiance, and sound effects during gameplay.

### Technologies

- Built with **Svelte 5.x** and **Tauri 2.x**.

### Features

- Three dedicated players:
  - **Music Playlist Player**
  - **Ambience Playlist Player**
  - **Sound Effects Sample Player**
- Imported audio files are stored locally in `AppLocalData/audio/`.
- Playlists are saved in **IndexedDB** for fast access and management.

## Using

1. Download the latest released installer for your OS from the releases page.

2. Run the installer and follow the instructions.

3. Launch the application

4. Drag and drop .mp3 of .waw files to the sections of your interset.

## Developing

To start the development clone the repo and:

```bash
npm install

npm run tauri dev

```

## Building

To create a production version of your app:

```bash
npm run tauri build
```

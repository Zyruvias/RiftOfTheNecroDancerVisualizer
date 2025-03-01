# Installation and Use
If you want to simply use this site, visit [the hosted page for the repository here](https://zyruvias.github.io/RiftOfTheNecroDancerVisualizer/). Then see the `Detailed Use` section below.

## Local installation and running
To install locally for contributing to development or other uses, ensure you have the latest version of node installed.
Clone or download the repository and navigate to the `vibe-optimizer` folder.

Run
```
npm install
```
to install the node modules required, then
```
npm run dev
```

to run the local development server. http://localhost:5173/RiftOfTheNecroDancerVisualizer is the default URL for the application running on the dev server.

## Detailed Use
Select a song and difficulty from the dropdowns as labeled. The track data will process and display the precomputed hit-splat locations for the given track. The visualization is read as follows:
* Each three squares of blocks is a single beat in the song, size is independent of song BPM.
* The top square is the left track
* The middle square is the middle track
* The bottom square is the right track.
* (Alternatively, rotating your head to the right if you are able will give you a view congruent to the actual track direction. I am hoping to have this be configurable in a later update)
* Blue dots are hits for enemies, regardless of what enemy it is for the given hit timing.
* Orange dots are enemies that are generally considered to be part of the active optimal Vibe Power use (plus or minus one enemy, still working out some bugs in calculation)
* Highlighted yellow sections are also the approximate Vibe Power duration / section to help with visualizing at a glance.

# Feedback and Bug Reporting
If you have a GitHub account, please post any bug reports [here](https://github.com/Zyruvias/RiftOfTheNecroDancerVisualizer/issues). Please give enough detail for me to be able to idenitfy the issue and resolve it in a meaningful way.

For general feedback, feel free to create an issue, or create a Github Discussion under the same repository. Alternatively, DM me on Discord (@zyruvias).

# License
This repository is licensed under the MIT license. Please refer to `LICENSE.md` for exact details. 
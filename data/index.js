import { tracks } from "./TrackList.json"

export const TRACK_LIST = tracks

// TODO: track files should just be renamed but I got lazy
export const getTrack = async (track, difficulty) => {
    try {
        return await import(`./Charts/${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}.json`)
    } catch (e) {
        console.warn(e)
        return await import(`./Charts/${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}_DoubleSpeed.json`)
    }
}

export const getTrackBeatMap = async (track, difficulty) => {
    const beatmapName = track.value.replace(/'|_|\s+/g, "")
    
    try {
        const data =  await fetch(`data/HitMaps/all_${difficulty.label.toLowerCase()}/RR${beatmapName}.txt?url`)
        return await data.text()
    } catch (e) {
        console.error(track, difficulty, e)
    }
}
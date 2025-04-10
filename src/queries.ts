import { useQuery } from "@tanstack/react-query"
// this points to a copy that imports the sheet and flattens headers
const SHEET_ID = "1-bOc-4td8X17ZW-5FdDVhQmCirQDIToFuaPfWadXA9Q"
const SHEET_NAME = "Sheet1"

import { tracks } from "./data/TrackList.json"

export const TRACK_LIST = tracks
const CURRENT_DATA_VERSION = "v1.2.4"

// TODO: track files should just be renamed but I got lazy
export const getTrack = async (track, difficulty) => {
    try {
        return await import(`./data/Charts/${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}.json`)
    } catch (e) {
        console.warn(e)
        return await import(`./data/Charts/${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}_DoubleSpeed.json`)
    }
}

const diffMap = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3,
    "Impossible": 4,
}

const getTrackData = async (track, difficulty) => {
    return await import(`./data/HitMapsV2/${track.hitMap}-${diffMap[difficulty.value]}.json`)
}

const BASE_URL = "https://raw.githubusercontent.com/KayDeeTee/RotN-Hitmapper"

const getTrackData2 = async (track, difficulty) => {
    const response = await fetch(
        `${BASE_URL}/refs/tags/${CURRENT_DATA_VERSION}/Charts/${track.hitMap}-${diffMap[difficulty.value]}.json`)
    const json = await response.json()
    return json
}

export const albumImageURL = (song) =>  `${BASE_URL}/refs/tags/${CURRENT_DATA_VERSION}/AlbumArts/${song}`


export const useTrackData = (track, difficulty) =>
    useQuery({
        queryKey: [track.value, difficulty],
        staleTime: Infinity,
        queryFn: () => getTrackData2(track, difficulty)
    })

export const getTrackBeatMap = async (track, difficulty) => {
    const beatmapName = track.value.replace(/'|_|\s+/g, "")
    
    try {
        const data =  await fetch(`data/HitMaps/all_${difficulty.label.toLowerCase()}/RR${beatmapName}.txt?url`)
        return await data.text()
    } catch (e) {
        console.error(track, difficulty, e)
    }
}

const getVibePowerValues = async () => {
    try {
        const result = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
        const res = await result.json()
        if (res.error) {
            console.warn(res.error)
            return []
        }
        return res
    } catch (e) {
        console.error(e)
        return {}
    }
}
export type VibeLength = "Single" | "Double" | "Triple"

export type Vibe = {
    bars: VibeLength,
    beat: number,
    combo: number,
    enemies: number,
}

export const getVibePathForTrackAndDifficulty = (data: Array<any>, track, difficulty): Vibe[] => {

    if (!data) {
        return []
    }
    const [row] = data.filter((row) => {
        if (row["Song"] === track.label && difficulty.label === row["Difficulty"]) {
            return true
        }
        return false
    })

    if (!row) {
        console.error(`Error: could not find track: ${track.label} (${track.value}) in vibe power data`)
    }

    const vibeActivations: Vibe[] = []

    // TODO: generalization for arbitrary number of vibes
    for (let i = 1; i <= 10; i++) {
        if (!row?.[`Vibe ${i} - Bars`]) {
            continue
        }
        const bars = row[`Vibe ${i} - Bars`]
        const beat = Number(row[`Vibe ${i} - Beat`].substring(1)) // B215 -> 215
        const combo = Number(row[`Vibe ${i} - Combo`])
        const enemies = Number(row[`Vibe ${i} - Enemies`])

        vibeActivations.push({
            bars,
            beat,
            combo,
            enemies
        })
    }

    return vibeActivations
}

export const useVibePowerPaths =  () => {
 // https://opensheet.elk.sh/spreadsheet_id/tab_name

 return useQuery({
    queryKey: ["vibe-power"],
    staleTime: Infinity,
    queryFn: getVibePowerValues,
 })
}

export type Release = {
    published_at: string
    tag_name: string
    name: string
    body: string
}

const getReleaseNotes = async (): Promise<Release[]> => {
    const results = await fetch("https://api.github.com/repos/Zyruvias/RiftOfTheNecroDancerVisualizer/releases")
    const json = await results.json()
    return json
}

export const useReleaseNotes = () => useQuery({
    queryFn: getReleaseNotes,
    staleTime: Infinity,
    queryKey: ["releases"]
})
import { useQuery } from "@tanstack/react-query"

const SHEET_ID = "1-bOc-4td8X17ZW-5FdDVhQmCirQDIToFuaPfWadXA9Q"
const SHEET_NAME = "Sheet1" // fragile?

const getVibePowerValues = async () => {
    try {
        const result = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
        const res = await result.json()
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
    console.log(json)
    return json
}

export const useReleaseNotes = () => useQuery({
    queryFn: getReleaseNotes,
    staleTime: Infinity,
    queryKey: ["releases"]
})
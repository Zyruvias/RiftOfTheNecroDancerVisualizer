import type { Vibe } from "./queries"
// TODO: core logical functions

/*
"type": "SpawnEnemy",
            "dataPairs": [
                {
                    "_eventDataValue": "1722",
                    "_eventDataKey": "EnemyId"
                },
                {
                    "_eventDataValue": "True",
                    "_eventDataKey": "ShouldClampToSubdivisions"
                }
            ],
            "group": 0,
            "startBeatNumber": 0,
            "endBeatNumber": 1,
            "clipin": 0,
            "track": 2
*/
export type VibeWindow = "START" | "FULL" | "END" | "NONE"
export type Beat = {
    startBeat: number
    vibePowerDrain: number
    tracks: Array<any>
    bpm: number
    vibeDurationType: VibeWindow
    vibeOffset?: number
    vibe?: Vibe
}

const generateBeat = ({ bpm, startBeat, ...rest }): Partial<Beat> => {
    return {
        ...rest,
        startBeat,
        bpm,
        vibePowerDrain: 1 / 5 / 60 * bpm,
        tracks: [
            [],
            [],
            [],
        ]
    }
}

export const processTrackData2 = (trackData, beatMapData, vibePowerData: Vibe[]) => {
    if (!trackData || !beatMapData || !vibePowerData) {
        return
    }
    // console.log(trackData, beatMapData, vibePowerData)

    const {
        bpm,
        beatDivisions,
        events
    } = trackData

    let currentBPM = bpm

    const beats: Beat[] = []
    const lines = beatMapData.split("\n")
    const [trackName, difficulty, ...restLines] = lines

    const vibePowerDrain = bpm / 300 // drain in seconds per beat

    let currentVibeIndex = 0
    let monsterHitCount = 0

    let vibePowerActive = false

    for (const line of restLines) {
        if (line === "VCS" || line === "") {
            continue // TODO: figure out how best to display vibe path enemies
        }
        const [beat, track, time] = line.split(/,\s*/)
        const flooredBeatNumber = Math.floor(beat)
        const currentBeat = beats[flooredBeatNumber] ??
            generateBeat({
                startBeat: flooredBeatNumber,
                bpm: currentBPM,
            })
        const currentVibe = vibePowerData[currentVibeIndex] ?? {}

        // current hits between start combo and vibe enemy expectation sum
        vibePowerActive = currentVibe.combo + currentVibe.enemies > monsterHitCount &&  
            monsterHitCount >= currentVibe.combo
        // vibe power is activated BEFORE the next hit
        if (vibePowerActive) {
            currentBeat.vibe = currentVibe
            // first hit, assign "START"
            if (monsterHitCount === currentVibe.combo) {
                currentBeat.vibeDurationType = "START"
                currentBeat.vibeOffset = beat - flooredBeatNumber
            } else if (currentBeat.vibeDurationType === undefined) {
                // if we don't have a type it means we are on a new beat
                // so we assign "FULL"
                currentBeat.vibeDurationType = "FULL"
            }
        } else {

        }

        // assume we hit the monster. HIT THE MONSTER
        currentBeat.tracks?.[track]?.push({
            partialBeatOffset: beat - flooredBeatNumber,
            isVibeActive: vibePowerActive,
        })
        monsterHitCount += 1
        // post-hit processing, denote end of vibe path
        if (monsterHitCount === currentVibe.combo + currentVibe.enemies) {
            currentBeat.vibeDurationType = "END"
            currentBeat.vibe = currentVibe
            currentBeat.vibeOffset = beat - flooredBeatNumber
        }

        // past relevant combo for vibe, go next
        if (monsterHitCount > currentVibe.combo + currentVibe.enemies) {
            currentVibeIndex += 1
        }


        beats[flooredBeatNumber] = currentBeat

    }
    for (let i = 0; i < beats.length; i++) {
        if (beats[i]) {
            continue
        }
        // presume well-formed beats up to this point
        const vibeDurationType = ["START", "FULL"].includes(beats[i - 1]?.vibeDurationType) ? "FULL" : "NONE"
        beats[i] = generateBeat({
            startBeat: i,
            bpm: beats[i - 1]?.bpm ?? currentBPM,
            vibeDurationType,
        })
    }

    return beats


}
export const processTrackData = (trackData, beatMapData) => {
    if (!trackData) {
        return
    }

    const {
        bpm,
        beatDivisions,
        events
    } = trackData

    let currentBPM = bpm



    const beats: Beat[] = []
    let i = 0
    while (i < events.length) {
        // process event type
        const event = events[i]
        const {
            startBeatNumber,
            endBeatNumber,
            track,
        } = event

        const flooredBeatNumber = Math.floor(startBeatNumber)
        const currentBeat = beats[flooredBeatNumber] ??
            generateBeat({
                startBeat: flooredBeatNumber,
                bpm: currentBPM,
            })

        let enemy = {}

        switch (event.type) {
            case "SpawnEnemy":
                // handle enemy addition to beats
                event.dataPairs.forEach((p) => enemy[p._eventDataKey] = p._eventDataValue)
                enemy.partialBeatOffset = startBeatNumber - flooredBeatNumber
                currentBeat.tracks[track - 1].push(enemy)
                break
            case "AdjustBPM":
                currentBPM = event.dataPairs[0]._eventDataValue
                currentBeat.bpm = currentBPM
                continue
        }
        beats[flooredBeatNumber] = currentBeat
        i++
    }

    for (let i = 0; i < beats.length; i++) {
        if (beats[i]) {
            continue
        }
        // presume well-formed beats up to this point
        beats[i] = generateBeat({ startBeat: i, bpm: beats[i - 1]?.bpm ?? currentBPM })
    }

    return beats



    /* 
        return structure
        OPTION 1:
        {
            beats: [
                {
                    tracks: [

                    ]
                }
            ]
        }
    */

}

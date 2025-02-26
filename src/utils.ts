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
type Beat = {
    startBeat: number
    vibePowerDrain: number
    tracks: Array<any>
    bpm: number
    vibeActive: boolean
    vibe?: Vibe
}

const generateBeat = ({ bpm, startBeat }): Beat => {
    return {
        startBeat,
        bpm,
        vibePowerDrain: 1 / 5 / 60 * bpm,
        vibeActive: false,
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

    for (const line of restLines) {
        if (line === "VCS") {
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
        console.log(currentVibe)

        // current hits between start combo and vibe enemy expectation sum
        const isVibeActive = currentVibe && (currentVibe.combo + currentVibe.enemies < monsterHitCount &&
            monsterHitCount >= currentVibe.combo)
        // past relevant combo for vibe, go next
        if (monsterHitCount > currentVibe.combo + currentVibe.enemies) {
            currentVibeIndex += 1
        }
        
        const enemy = {
            partialBeatOffset: beat - flooredBeatNumber,
            isVibeActive,
        }

        currentBeat.tracks?.[track]?.push(enemy)
        monsterHitCount += 1


        beats[flooredBeatNumber] = currentBeat

    }
    for (let i = 0; i < beats.length; i++) {
        if (beats[i]) {
            continue
        }
        // presume well-formed beats up to this point
        beats[i] = generateBeat({ startBeat: i, bpm: beats[i - 1]?.bpm ?? currentBPM })
    }

    const barsMap = {
        Single: 5,
        Double: 10,
        Triple: 15,
    }

    for (const vibe of vibePowerData) {
        const beatStart = Math.ceil(vibe.beat)
        if (!beatStart) { // early vibe phrases delayed
            continue
        } 
        // TODO: granularize by enemy since activation is specific to enemies
        const secondsOfVibePower = barsMap[vibe.bars] ?? barsMap.Single
        const endBeat = beatStart + Math.ceil(secondsOfVibePower / vibePowerDrain)

        // flooring the beat will give us a reference to the partial activation period
        beats[Math.floor(vibe.beat) - 1].vibe = vibe

        for (let i = beatStart - 1; i < endBeat; i++) {
            if (beats[i]) {

                beats[i].vibeActive = true
                beats[i].vibe = vibe
            }
        }
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

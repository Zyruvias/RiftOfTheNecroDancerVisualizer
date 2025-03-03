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
const compileEnemyData = (event) => {
    const enemy = {}
    event.dataPairs.forEach((p) => enemy[p._eventDataKey] = p._eventDataValue)
    return enemy
}
const equalWithinFuzz = (num1, num2, fuzz) => {
    return Math.abs(num1 - num2) <= fuzz
}
const GREEN_SLIME = 1722
const WHITE_SKELETON_SHIELD = 1911
const BLUE_BAT = 8675309
const WHITE_SKELETON_DOUBLE_SHIELD = 6471
const WHITE_SKELETON = 2202
const WYRM = 7794
const BLUE_SLIME = 4355
const imageMap = {
    [GREEN_SLIME]: "./data/Enemies/GreenSlime/base.png",
    [WHITE_SKELETON_SHIELD]: "./data/Enemies/WhiteSkeletonShield/base.png",
    [BLUE_BAT]: "./data/Enemies/BlueBat/base.png",
    [WHITE_SKELETON_DOUBLE_SHIELD]: "./data/Enemies/WhiteSkeletonDoubleShield/base.png",
    [WHITE_SKELETON]: "./data/Enemies/WhiteSkeleton/base.png",
    [WYRM]: "./data/Enemies/Wyrm/base.png",
    [BLUE_SLIME]: "./data/Enemies/BlueSlime/base.png",
}

const wyrmImageMap = {
    body: "./data/Enemies/Wyrm/body.png",
    tail: "./data/Enemies/Wyrm/tail.png",
    head: "./data/Enemies/Wyrm/base.png",
}

const getEnemyHitInfo = ({ enemy, event }) => {
    let hitBeatOffset = 1
    let hitCount = 1
    let trackShift = 0
    let relevantBeatNumber = event.startBeatNumber + 9

    const enemyId = Number(enemy.EnemyId)

    switch (enemyId) {
        case BLUE_BAT:
            hitCount = 2
            trackShift = enemy.ShouldStartFacingRight ? 1 : -1
            break
        case BLUE_SLIME:
            hitCount = 2
            break
        case WHITE_SKELETON_DOUBLE_SHIELD:
            hitCount = 3
            hitBeatOffset = 0.5
            break
        case WHITE_SKELETON_SHIELD:
            hitCount = 2
            hitBeatOffset = 0.5
        case WYRM:
            hitCount = event.endBeatNumber - event.startBeatNumber - 1
            break
        default:
            break
    }

    return {
        hitBeatOffset, hitCount, trackShift, relevantBeatNumber
    }
}

const placeEnemyOnBeatMap = ({
    enemy,
    beats,
    event
}) => {
    let {
        hitBeatOffset,
        hitCount,
        trackShift,
        relevantBeatNumber,
    } = getEnemyHitInfo({ enemy, event })

    let currentBeat = event.startBeatNumber
    let currentTrack = event.track - 1
    let currentRelevantBeatIndex = relevantBeatNumber
    while (hitCount > 0) {
        const relevantBeat = beats[Math.floor(currentRelevantBeatIndex)]

        if (!relevantBeat) {
            console.log(currentRelevantBeatIndex)
        }
        const relevantEnemyObject =
            relevantBeat.tracks[currentTrack]
            // TODO: figure out appropriate accuracy from hitmaps to event json
                .find((e) => equalWithinFuzz(e.partialBeatOffset, (currentBeat % 1), 1 / 8))

        if (enemy.EnemyId == WYRM) {
            if (relevantEnemyObject) {
                relevantEnemyObject.transform = "rotate(90deg)"
            }
            // special case, need to create our own objects here to visualize the body and tail
            let currentWyrmBeat = currentBeat
            let currentLocalBeatIndex = currentRelevantBeatIndex
            while (currentWyrmBeat < event.endBeatNumber) {
                const beatTrack = beats[Math.floor(currentLocalBeatIndex)].tracks[currentTrack]
                if (currentWyrmBeat !== event.endBeatNumber - 1) {
                   beatTrack.unshift({
                        enemyId: WYRM,
                        image: wyrmImageMap.body,
                        height: 50,
                        left: 12.5,
                        transform: "rotate(90deg)"
                    })
                } else {
                    beatTrack.unshift({
                        enemyId: WYRM,
                        image: wyrmImageMap.tail,
                        transform: "rotate(90deg)"
                    })
                }
                currentWyrmBeat += 1
                currentLocalBeatIndex += 1
            }
        }
        if (enemy.EnemyId == BLUE_BAT) {

            console.log(event)
            console.log(enemy)
            console.log(currentRelevantBeatIndex, currentBeat, hitCount, enemy.EnemyId)
            console.log(`currentRelevantBeatIndex, currentBeat, hitCount, enemy.enemyId`)
        }
        if (!relevantEnemyObject) {
            return
        }
        // TODO: figure out conflicts in processing logic...
        if (relevantEnemyObject.enemyId === undefined) {
            relevantEnemyObject.enemyId = enemy.EnemyId
            relevantEnemyObject.image = imageMap[enemy.EnemyId]
        }
        
        hitCount -= 1
        if (enemy.EnemyId == BLUE_BAT) console.log(`currentTrack = (${currentTrack} + 3 + ${trackShift}) % 3`)
            currentTrack = (currentTrack + 3 + trackShift) % 3
        if (enemy.EnemyId == BLUE_BAT) console.log(`currentTrack = ${currentTrack}`)
        currentBeat += hitBeatOffset
        currentRelevantBeatIndex += hitBeatOffset
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

    // PROCESS ENEMIES
    for (const event of trackData.events) {
        if (event.type !== "SpawnEnemy") {
            continue // TODO figure this out later, more info on track, etc
        }
        const enemy = compileEnemyData(event)
        const startBeat = Math.floor(event.startBeatNumber)

        placeEnemyOnBeatMap({
            enemy,
            beats,
            event
        })
        
        
        // break
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

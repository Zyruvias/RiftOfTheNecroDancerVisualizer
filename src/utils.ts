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
const APPLE = 7358
const CHEESE = 2054
const YELLOW_SKELETON = 6803
const RED_BAT = 911
const YELLOW_BAT = 717
const BLADE_MASTER = 929
const YELLOW_SLIME = 9189
const DRUMSTICK = 1817
const YELLOW_ARMADILLO = 6311
const RED_ARMADILLO = 1707
const BLUE_ARMADILLO = 7831
const WHITE_SKULL = 4601
const BLUE_HARPY = 8156
const GREEN_HARPY = 8519
const RED_ZOMBIE = 1236
const GREEN_ZOMBIE = 1234

const imageMap = {
    [GREEN_SLIME]: "./data/Enemies/GreenSlime/base.png",
    [WHITE_SKELETON_SHIELD]: "./data/Enemies/WhiteSkeletonShield/base.png",
    [BLUE_BAT]: "./data/Enemies/BlueBat/base.png",
    [WHITE_SKELETON_DOUBLE_SHIELD]: "./data/Enemies/WhiteSkeletonDoubleShield/base.png",
    [WHITE_SKELETON]: "./data/Enemies/WhiteSkeleton/base.png",
    [WYRM]: "./data/Enemies/Wyrm/base.png",
    [BLUE_SLIME]: "./data/Enemies/BlueSlime/base.png",
    [APPLE]: "./data/Enemies/Apple/RR_HealthItem_Apple_Hit0.png",
    [YELLOW_SKELETON]: "./data/Enemies/YellowSkeleton/base.png",
    [RED_BAT]: "./data/Enemies/RedBat/base.png",
    [CHEESE]: "./data/Enemies/Cheese/base.png",
    [YELLOW_BAT]: "./data/Enemies/YellowBat/base.png",
    [BLADE_MASTER]: "./data/Enemies/RedBladeMaster/base.png",
    [YELLOW_SLIME]: "./data/Enemies/YellowSlime/base.png",
    [DRUMSTICK]: "./data/Enemies/Drumstick/base.png",
    [RED_ARMADILLO]: "./data/Enemies/RedArmadillo/base.png",
    [YELLOW_ARMADILLO]: "./data/Enemies/YellowArmadillo/base.png",
    [BLUE_ARMADILLO]: "./data/Enemies/BlueArmadillo/base.png",
    [WHITE_SKULL]: "./data/Enemies/WhiteSkull/base.png",
    [BLUE_HARPY]: "./data/Enemies/BlueHarpy/base.png",
    [GREEN_HARPY]: "./data/Enemies/GreenHarpy/base.png",
    [GREEN_ZOMBIE]: "./data/Enemies/GreenZombie/base.png",
    [RED_ZOMBIE]: "./data/Enemies/RedZombie/base.png",
}

const wyrmImageMap = {
    body: "./data/Enemies/Wyrm/body.png",
    tail: "./data/Enemies/Wyrm/tail.png",
    head: "./data/Enemies/Wyrm/base.png",
}

const getEnemyHitInfo = ({ enemy, event }) => {
    let hitBeatOffset = 1
    let hitCount = 1
    let trackShift: number | number[] = 0
    let relevantBeatNumber = event.startBeatNumber + 9
    let initialTrackShift = 0

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
            break
        case WYRM:
            hitCount = event.endBeatNumber - event.startBeatNumber - 1
            break
        case YELLOW_SKELETON:
            hitCount = 2
            break
        case RED_BAT:
            hitCount = 3
            trackShift = enemy.ShouldStartFacingRight ? [1, -1] : [-1, 1]
            break
        case CHEESE:
            hitCount = 2
            break
        case YELLOW_BAT:
            hitCount = 3
            trackShift = enemy.ShouldStartFacingRight ? 1 : -1
            break
        case YELLOW_SLIME:
        case DRUMSTICK:
            hitCount = 3
            break
        case BLADE_MASTER:
            // relevantBeatNumber = event.startBeatNumber + 9 + Number(enemy.BladeMasterAttackRow) - 1
            break
        case RED_ARMADILLO:
            hitCount = 2
            hitBeatOffset = 2/3
            break
        case YELLOW_ARMADILLO:
            hitCount = 3
            hitBeatOffset = 1/3
            break
        case BLUE_ARMADILLO:
            hitCount = 2
            hitBeatOffset = 1/3
            break
        case BLUE_HARPY:
            hitCount = 2
            hitBeatOffset = 2
            break
        case GREEN_HARPY:
            hitCount = 1
            break
        
        case GREEN_ZOMBIE:
            initialTrackShift = 0
            break
        case RED_ZOMBIE:
            initialTrackShift = enemy.ShouldStartFacingRight ? 2 : -2
            break
        case GREEN_SLIME:
        case WHITE_SKELETON:
        case APPLE:
        case WHITE_SKULL:
            break
        default:
            console.log(event, enemy)
            break
    }

    return {
        hitBeatOffset, hitCount, trackShift, relevantBeatNumber, initialTrackShift
    }
}

const findEnemy = (beatObj, beat, track, offset) => 
    beatObj.tracks[track]
            // TODO: figure out appropriate accuracy from hitmaps to event json
                .find((e) => equalWithinFuzz(offset, (beat % 1), 1 / 8))

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
        initialTrackShift
    } = getEnemyHitInfo({ enemy, event })

    let currentBeat = event.startBeatNumber
    let currentTrack = (event.track - 1 + initialTrackShift + 3) % 3
    let currentRelevantBeatIndex = relevantBeatNumber
    while (hitCount > 0) {
        const relevantBeat = beats[Math.floor(currentRelevantBeatIndex)]
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
                        left: 25,
                        transform: "rotate(90deg)",
                        partialBeatOffset: currentLocalBeatIndex - Math.floor(currentLocalBeatIndex)
                    })
                } else {
                    beatTrack.unshift({
                        enemyId: WYRM,
                        image: wyrmImageMap.tail,
                        partialBeatOffset: currentLocalBeatIndex - Math.floor(currentLocalBeatIndex),
                        transform: "rotate(90deg)",
                        height: 50,
                        left: 20,
                    })
                }
                currentWyrmBeat += 1
                currentLocalBeatIndex += 1
            }
        }
        if ([WHITE_SKULL].includes(enemy.EnemyId) && hitCount === 1) {
            const spawnDirection = enemy.ShouldStartFacingRight ? -1 : 1
            const spawnBeat = Math.floor(currentRelevantBeatIndex) + 1
            const newRelevantBeat = beats[spawnBeat]
            let spawnTrack = currentTrack

            for (let i = 0; i < 2; i++) {
                const newEnemy =
                    newRelevantBeat.tracks[spawnTrack]
                    // TODO: figure out appropriate accuracy from hitmaps to event json
                        .find((e) => equalWithinFuzz(e.partialBeatOffset, (currentBeat % 1), 1 / 8))
                if (newEnemy) {
                    newEnemy.enemyId ??= WHITE_SKELETON
                    newEnemy.image ??= imageMap[WHITE_SKELETON]
                }
                spawnTrack = (spawnTrack + 3 + spawnDirection) % 3
            }
        }
        if (!relevantEnemyObject) {
            return
        }
        // TODO: figure out conflicts in processing logic...
        if (relevantEnemyObject.enemyId === undefined) {
            relevantEnemyObject.enemyId = enemy.EnemyId
            relevantEnemyObject.image = imageMap[enemy.EnemyId]
        }

        const trackShiftToPerform = trackShift?.shift?.() ?? trackShift
        
        hitCount -= 1
        currentTrack = (currentTrack + 3 + trackShiftToPerform) % 3
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

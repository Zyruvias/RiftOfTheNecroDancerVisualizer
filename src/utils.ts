import type { Vibe } from "./queries"
import enemyData from "./data/EnemyData.json"

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

const generateBeat = ({ startBeat, ...rest }): Partial<Beat> => {
    return {
        ...rest,
        startBeat,
        tracks: [
            [],
            [],
            [],
        ]
    }
}

export const processTrackData3 = (hitmapData, vibeData) => {
    console.log("process track data 3")
    if (!hitmapData || !vibeData) {
        return
    }
    // console.log(trackData, beatMapData, vibePowerData)


    let currentVibeIndex = 0
    let monsterHitCount = 0

    let vibePowerActive = false

    const beats: Beat[] = []
    const enemyHealthMap = {}
    const wyrmEventsToPostProcess: any[] = []
    for (const event of hitmapData.events) {
        if (event.Event === "WyrmEnd") {
            wyrmEventsToPostProcess.push(event)
            continue
        }
        if (!["HitEnemy","WyrmSection"].includes(event.Event) ) {
            // console.log(event)
            continue // TODO: figure this out
        }
        /* 
            "GUID": "6a4e7c74-ebf8-4a39-a65d-045b3e86aebb",
            "ID": "929",
            "Facing": "Left",
            "Health": "1",
            "X": "1",
            "Y": "0",
            "Beat": "13",
            "Time": "3.75",
            "Spawn": "5",
            "Vibe": "False",
            "Burning": "False",
            "Mysterious": "False",
            "Event": "HitEnemy"
        */
        const {
            GUID: guid,
            ID: id,
            X: x,
            Y: Y,
            Time: time,
            Beat: beat,
            Facing: facingDirection,
            Health: health,
            Vibe,
        } = event

        // conver to bool
        const isVibePhraseEnemy = Vibe === "True" ? true : false
        // assign max health value
        enemyHealthMap[guid] ??= health

        const flooredBeatNumber = Math.floor(beat) - 1
        const currentBeat = beats[flooredBeatNumber] ??
            generateBeat({
                startBeat: flooredBeatNumber,
            })
        // current hits between start combo and vibe enemy expectation sum
        const currentVibe = vibeData[currentVibeIndex] ?? {}
        vibePowerActive = currentVibe.combo + currentVibe.enemies > monsterHitCount &&  
            monsterHitCount >= currentVibe.combo
        // vibe power is activated BEFORE the next hit
        if (vibePowerActive) {
            currentBeat.vibe = currentVibe
            // first hit, assign "START"
            if (monsterHitCount === currentVibe.combo) {
                currentBeat.vibeDurationType = "START"
                currentBeat.vibeOffset = beat - 1 - flooredBeatNumber
            } else if (currentBeat.vibeDurationType === undefined) {
                // if we don't have a type it means we are on a new beat
                // so we assign "FULL"
                currentBeat.vibeDurationType = "FULL"
            }
        } else {

        }
        // assume we hit the monster. HIT THE MONSTER
        const currentEnemyData = enemyData[id]
        let enemy =  {
            ...currentEnemyData,
            partialBeatOffset: beat - 1 - flooredBeatNumber,
            isVibeActive: vibePowerActive,
            enemyId: id,
            image: currentEnemyData.image,
            beat,
            guid,
            health,
            x,
            isVibePhraseEnemy,
            maxHealth: enemyHealthMap[guid],
        }
        if (id == 7794) {
            // wyrm transforms
            // transform: "rotate(90deg)",
            // enemy.height = 50,
            // enemy.left = 20
            enemy.transform = "rotate(90deg)"
        }
        if (event.Event === "WyrmSection") {
            enemy.image = enemyData[8079].image
            enemy.height = 50
            enemy.left = "-50%"
            enemy.zIndex = 1.5
        }
        currentBeat.tracks[x]?.push({ ... enemy})
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

    // process wyrm tails
    for (const event of wyrmEventsToPostProcess) {
        const {
            X: x,
            Beat: beat,
        } = event
        const flooredBeatNumber = Math.floor(beat) - 1
        const currentBeat = beats[flooredBeatNumber] ??
            generateBeat({
                startBeat: flooredBeatNumber,
            })
        currentBeat.tracks[x].forEach(e => {
            if (e.beat === beat) {
                e.image = enemyData[9888].image
            }
        })

    }
    
    for (let i = 0; i < beats.length; i++) {
        if (beats[i]) {
            continue
        }
        // presume well-formed beats up to this point
        const vibeDurationType = ["START", "FULL"].includes(beats[i - 1]?.vibeDurationType) ? "FULL" : "NONE"
        beats[i] = generateBeat({
            startBeat: i,
            vibeDurationType,
        }) as Beat
    }

    return beats


}
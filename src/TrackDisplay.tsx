import React, { useMemo } from "react"
import { Button, Group, Text, Collapse, Box, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from "./TrackDisplay.module.css"

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

const processTrackData2 = (trackData, beatMapData, vibePowerData) => {
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

        currentBeat.tracks?.[track]?.push({ partialBeatOffset: beat - flooredBeatNumber })

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
        const beatStart = vibe.beat
        if (beatStart === "") { // early vibe phrases delayed
            continue
        } 
        // TODO: granularize by enemy since activation is specific to enemies
        const secondsOfVibePower = barsMap[vibe.bars] ?? barsMap.Single
        const endBeat = beatStart + Math.ceil(secondsOfVibePower / vibePowerDrain)

        for (let i = beatStart - 1; i < endBeat; i++) {
            if (beats[i]) {

                beats[i].vibeActive = true
            }
        }
    }


    return beats


}
const processTrackData = (trackData, beatMapData) => {
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


const Expand = ({ children, title }) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box mx="auto" m={50}>
      <Group justify="center" mb={5} p={5}>
        <Button onClick={toggle}>{title}{" "}{opened ? "^" : "v"}</Button>
      </Group>

      <Collapse in={opened}>
        {children}
      </Collapse>
    </Box>
  );
}

export const Hit = ({
    offset
}) => {
    return <div style={{
        position: "absolute",
        backgroundColor: "blue",
        borderRadius: "50%",
        minWidth: "5px",
        minHeight: "5px",
        offsetAnchor: "center",
        left: "-2.5px",
        transformOrigin: "center",
        transform: `translate(${Math.round((offset ?? 0) * 1000)}%, 0%)`,
        zIndex: 2,
    }} />
}

export const Beat = ({
    startBeat,
    tracks,
    vibeActive,
}: Beat) => {
    return <Stack className={classes.beat}>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeActive}}>
            {/* {tracks[0].map((e) => e.EnemyId)} */}
            {tracks[0].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 !== 0, vibe: vibeActive}}>
            {/* {tracks[1].map((e) => e.EnemyId)} */}
            {tracks[1].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeActive}}>
            {/* {tracks[2].map((e) => e.EnemyId)} */}
            {tracks[2].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
    </Stack>
}

export const TrackDisplay = ({
    trackData,
    beatData,
    vibeData
}) => {


    const processedTrackData = useMemo(() => processTrackData(trackData, beatData), [trackData, beatData])
    const processedTrackData2 = useMemo(() => processTrackData2(trackData, beatData, vibeData), [trackData, beatData, vibeData])

    return (
        <>
            <Expand title={"Track Data (original"}>
                <Group gap={0}>
                    {JSON.stringify(trackData)}
                </Group>
            </Expand>
            <Expand title={"Processed Track Data"}>
                <Group gap={0}>
                    {processedTrackData2?.map((beat, i) =>  <Beat key={i} {...beat} />)}
                </Group>
            </Expand>
        </>
    )
}
import React, { useContext, useMemo } from "react"
import { Button, Group, Collapse, Box, Stack, AccordionChevron, Code, Center } from '@mantine/core';
import { processTrackData2, processTrackData3 } from "../utils"
import { useDisclosure } from '@mantine/hooks'
import classes from "./TrackDisplay.module.css"
import type { Beat as BeatProps } from "../utils"
import { defaultSettings, SettingsContext } from "../SettingsContext"
import { Hit } from "./Hit";

export const Beat = ({
    startBeat,
    tracks,
    vibeDurationType,
    vibe,
    vibeOffset,
    showEnemyImages,
    hitSplatColor,
    hitSplatSize,
    hitSplatVibeColor,
    vibePowerShadingColor,
    showVibePath,
    showBeatNumber,
}: Partial<BeatProps> & typeof defaultSettings) => {
    let finalVibeOffset
    if (vibeOffset) {
        // eliminates 0
        finalVibeOffset = vibeOffset
        if (vibeDurationType === "START" ) {
            finalVibeOffset = 1 - vibeOffset
        }
    }
    const backgroundImage = showVibePath && vibeDurationType === "FULL" ?
        `linear-gradient(to left, ${vibePowerShadingColor} 100%, transparent 100%)` : undefined

    return <Stack gap={0}>
        {showBeatNumber && <span style={{ fontSize: "0.8rem"}}>{startBeat + 1}</span>}
        <Stack
                className={classes.beat} mod={{ offset: vibeOffset }}>
            <Group
                className={classes.track}
                mod={{ shaded: startBeat % 2 === 0, vibe: vibeDurationType === "FULL"}}
                style={{ backgroundImage }}
            >
                {tracks[0].map((e) => 
                    <Hit
                        enemy={e}
                        offset={e.partialBeatOffset}
                        color={hitSplatColor}
                        vibeColor={hitSplatVibeColor}
                        useImage={showEnemyImages}
                        size={hitSplatSize}
                    />
                )}
            </Group>
            <Group
                className={classes.track}
                mod={{ shaded: startBeat % 2 !== 0, vibe: vibeDurationType === "FULL"}}
                style={{ backgroundImage }}
            >
                {tracks[1].map((e) => 
                    <Hit
                        enemy={e}
                        offset={e.partialBeatOffset}
                        color={hitSplatColor}
                        vibeColor={hitSplatVibeColor}
                        useImage={showEnemyImages}
                        size={hitSplatSize}
                    />
                )}
            </Group>
            <Group
                className={classes.track}
                mod={{ shaded: startBeat % 2 === 0, vibe: vibeDurationType === "FULL"}}
                style={{ backgroundImage }}
            >
                {tracks[2].map((e) => 
                    <Hit
                        enemy={e}
                        offset={e.partialBeatOffset}
                        color={hitSplatColor}
                        vibeColor={hitSplatVibeColor}
                        useImage={showEnemyImages}
                        size={hitSplatSize}
                    />
                )}
            </Group>
            {showVibePath && ["START", "END"].includes(vibeDurationType) && <div style={{
                position: "absolute",
                minWidth: "50px",
                minHeight: "75px",
                backgroundImage: `linear-gradient(to left, ${vibePowerShadingColor} 100%, transparent 100%)`,
                backgroundSize: `${Math.round(finalVibeOffset * 100)}%`,
                backgroundPosition: vibeDurationType === "START" ? "right" : "left",
                backgroundRepeat: "no-repeat",
                zIndex: 1.5,
            }}/>}
        </Stack>
    </Stack>
}

export const TrackDisplay = ({
    trackData,
    beatData,
    vibeData,
    hitmapData
}) => {

    const { options, setOptions } = useContext(SettingsContext)


    const processedTrackData2 = useMemo(() => processTrackData2(trackData, beatData, vibeData), [trackData, beatData, vibeData])
    const processedTrackData3 = useMemo(() => processTrackData3(hitmapData, vibeData), [hitmapData, vibeData])

    return (
        <Group gap={0} className={classes.content}>
            {processedTrackData3?.map((beat, i) =>
                <Beat
                    key={i}
                    {...beat}
                    {...options}
                />
            )}
        </Group>
    )
}
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Group, Stack, AccordionChevron, Code, Center, Flex } from '@mantine/core';
import { processTrackData3 } from "../utils"
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
    useReducedMotion,
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
                        useReducedMotion={useReducedMotion}
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
                        useReducedMotion={useReducedMotion}
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
                        useReducedMotion={useReducedMotion}
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
    vibeData,
    hitmapData
}) => {

    const { options } = useContext(SettingsContext)

    const [data, setData] = useState<BeatProps[] | undefined>()

    useEffect(() => {
        (async () => setData(processTrackData3(hitmapData, vibeData)))()
    }, [hitmapData, vibeData])

    const direction = "row"

    return (
        <Group gap={0} className={classes.content}>
            {data?.map((beat, i) =>
                <Beat
                    key={i}
                    {...beat}
                    {...options}
                />
            )}
        </Group>
    )
}
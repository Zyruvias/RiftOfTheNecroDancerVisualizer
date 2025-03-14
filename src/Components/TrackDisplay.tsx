import React, { useContext, useMemo } from "react"
import { Button, Group, Collapse, Box, Stack, AccordionChevron, Code, Center } from '@mantine/core';
import { processTrackData2 } from "../utils"
import { useDisclosure } from '@mantine/hooks'
import classes from "./TrackDisplay.module.css"
import type { Beat as BeatProps } from "../utils"
import { defaultSettings, SettingsContext } from "../SettingsContext"
import { Hit } from "./Hit";


const Expand = ({ children, title, boxStyle }) => {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <Box mx="auto" m={50}>
      <Group justify="center" mb={5} p={5}>
        <Button
            onClick={toggle}
            rightSection={<AccordionChevron/>}
        >
            {title}
        </Button>
      </Group>

      <Collapse in={opened} style={boxStyle}>
        {children}
      </Collapse>
    </Box>
  );
}

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
    vibeData
}) => {

    const { options, setOptions } = useContext(SettingsContext)


    const processedTrackData2 = useMemo(() => processTrackData2(trackData, beatData, vibeData), [trackData, beatData, vibeData])

    return (
        <>
            {/* <Expand title={"Processed Track Data"}> */}
                <Group gap={0} className={classes.content}>
                    {processedTrackData2?.map((beat, i) =>
                        <Beat
                            key={i}
                            {...beat}
                            {...options}
                        />
                    )}
                </Group>
            {/* </Expand> */}
            <Expand title={"Track Data (original"}>
                <Center>
                    <Group align="top" mah={"40hv"} preventGrowOverflow>
                        <Code block>
                            {beatData}
                        </Code>
                        <Code block>
                            {JSON.stringify(trackData, null, 2)}
                        </Code>
                    </Group>
                </Center>
            </Expand>
        </>
    )
}
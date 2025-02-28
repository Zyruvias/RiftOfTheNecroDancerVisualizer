import React, { useMemo, useRef } from "react"
import { Button, Group, Collapse, Box, Stack, AccordionChevron, Code, Center } from '@mantine/core';
import { processTrackData, processTrackData2 } from "./utils"
import { useDisclosure } from '@mantine/hooks';
import classes from "./TrackDisplay.module.css"
import type { VibeWindow, Beat as BeatProps } from "./utils";


const Expand = ({ children, title, boxStyle }) => {
  const [opened, { toggle }] = useDisclosure(false);

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

export const Hit = ({
    offset,
    enemy
}) => {
    return <div style={{
        position: "absolute",
        ...(enemy.isVibeActive ? {
            backgroundColor: "orange",
            borderWidth: "1px"
        } : {
            backgroundColor: "blue",
        }),

        borderRadius: "50%",
        minWidth: "5px",
        minHeight: "5px",
        offsetAnchor: "center",
        left: "-2.5px",
        transformOrigin: "center",
        // TODO: ratio of height/width not magic number
        transform: `translate(${Math.round((offset ?? 0) * 1000)}%, 0%)`,
        zIndex: 2,
    }} />
}

export const Beat = ({
    startBeat,
    tracks,
    vibeDurationType,
    vibe,
    vibeOffset,
}: Partial<BeatProps>) => {
    let finalVibeOffset
    if (vibeOffset) {
        // eliminates 0
        finalVibeOffset = vibeOffset
        if (vibeDurationType === "START" ) {
            finalVibeOffset = 1 - vibeOffset
        }
    }
    const yellow = "rgba(255, 255, 0, 0.25)"
    return <Stack className={classes.beat} mod={{ offset: vibeOffset }}>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeDurationType === "FULL"}}>
            {tracks[0].map((e) => <Hit enemy={e} offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 !== 0, vibe: vibeDurationType === "FULL"}}>
            {tracks[1].map((e) => <Hit enemy={e} offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeDurationType === "FULL"}}>
            {tracks[2].map((e) => <Hit enemy={e} offset={e.partialBeatOffset} />)}
        </Group>
        {["START", "END"].includes(vibeDurationType) && <div style={{
            position: "absolute",
            minWidth: "50px",
            minHeight: "75px",
            backgroundImage: `linear-gradient(to left, ${yellow} 100%, transparent 100%)`,
            backgroundSize: `${Math.round(finalVibeOffset * 100)}%`,
            backgroundPosition: vibeDurationType === "START" ? "right" : "left",
            backgroundRepeat: "no-repeat",
            flexGrow: 1,
            zIndex: 1.5,
        }}/>}
    </Stack>
}

export const TrackDisplay = ({
    trackData,
    beatData,
    vibeData
}) => {


    const processedTrackData2 = useMemo(() => processTrackData2(trackData, beatData, vibeData), [trackData, beatData, vibeData])

    return (
        <>
            {/* <Expand title={"Processed Track Data"}> */}
                <Group gap={0} className={classes.content}>
                    {processedTrackData2?.map((beat, i) =>  <Beat key={i} {...beat} />)}
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
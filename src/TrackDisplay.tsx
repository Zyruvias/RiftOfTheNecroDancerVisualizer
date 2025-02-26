import React, { useMemo, useRef } from "react"
import { Button, Group, Collapse, Box, Stack, AccordionChevron } from '@mantine/core';
import { processTrackData, processTrackData2 } from "./utils"
import { useDisclosure } from '@mantine/hooks';
import classes from "./TrackDisplay.module.css"


const Expand = ({ children, title }) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box mx="auto" m={50}>
      <Group justify="center" mb={5} p={5}>
        <Button
            onClick={toggle}
            rightSection={<AccordionChevron className={classes.chevron}/>}
        >
            {title}
        </Button>
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
        // TODO: ratio of height/width not magic number
        transform: `translate(${Math.round((offset ?? 0) * 1000)}%, 0%)`,
        zIndex: 2,
    }} />
}

export const Beat = ({
    startBeat,
    tracks,
    vibeActive,
    vibe,
}: Partial<typeof Beat>) => {
    let vibeOffset
    let realBeat = startBeat + 1
    if (vibe?.beat > realBeat && vibe.beat - realBeat < 1) {
        vibeOffset = vibe.beat - realBeat
    }

    const stackRef = useRef(null)
    if (vibe?.beat && startBeat < vibe.beat) {
        console.log(stackRef)
    }
    const yellow = "rgba(255, 255, 0, 0.25)"
    return <Stack ref={stackRef} className={classes.beat} mod={{ offset: vibeOffset }}>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeActive}}>
            {tracks[0].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 !== 0, vibe: vibeActive}}>
            {tracks[1].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
        <Group className={classes.track} mod={{ shaded: startBeat % 2 === 0, vibe: vibeActive}}>
            {tracks[2].map((e) => <Hit offset={e.partialBeatOffset} />)}
        </Group>
        {vibeOffset && <div ref={stackRef} style={{
            position: "absolute",
            minWidth: "50px",
            minHeight: "75px",
            backgroundImage: `linear-gradient(to left, ${yellow} 100%, transparent 100%)`,
            backgroundSize: `${Math.round(vibeOffset * 100)}%`,
            backgroundPosition: "right",
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
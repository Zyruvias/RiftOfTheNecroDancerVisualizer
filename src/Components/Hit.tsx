import React, { useContext } from "react"
import { PortalTooltipContext } from "./PortalTooltip"
import { Group, Text, Image, Stack } from "@mantine/core"
import classes from "./Hit.module.css"

const trackIndexToText = {
    0: "Left",
    1: "Middle",
    2: "Right",
}

export const Hit = ({
    useImage,
    offset,
    enemy,
    color,
    size,
    vibeColor,
    useReducedMotion
}) => {

    const { setTargetId, setContent, targetId } = useContext(PortalTooltipContext)
    // set tooltip context
    const onHover = (e) => {
        // return
        const enemyBeat = +enemy.beat % 1 === 0 ?
            +enemy.beat : Number(enemy.beat).toFixed(2)
        setContent(
            <div>
                {/* {JSON.stringify(enemy, null, 2).split("\n").map((t) => 
                    <>
                        <Text>{t}</Text>
                    </>
                )} */}
                <Group>
                    <Stack gap={0} style={{ marginInlineEnd: "auto" }}>

                        <Text>{enemy.name}</Text>
                        <Text>{trackIndexToText[enemy.x]} Track</Text>
                        <Text>Beat - {enemyBeat}</Text>
                        <Text>Health - {enemy.health} / {enemy.maxHealth}</Text>
                        {enemy.isVibePhraseEnemyk &&
                            <Text>Active Vibe Phrase</Text>
                        }
                    </Stack>
                    <Image
                        classNames={{ root: classes.hit }}
                        mod={{ vibe: enemy.isVibePhraseEnemy }}
                        src={enemy.image}
                        height={60}
                        width={60}
                    />
                </Group>


            </div>
        )
        setTargetId(e.target)
    }
    const translate = (size) => `translate(${Math.round((offset ?? 0) * 50 / size * 100)}%, 0%) ${enemy.transform ?? ""} `
    const hitStyles = {
        position: "absolute",
        offsetAnchor: "center",
        left: `-${size/2}px`,
        transformOrigin: "center",
        // TODO: ratio of height/width not magic number
        transform: translate(size),
        zIndex: 2
    } as any
    if (useImage) {
        const size = 20
        // wyrm edge cases...
        const left = enemy.left ?? `-${size/2}px`
        // const bottom = enemy.bottom
        const styles = {...hitStyles, left, transform: translate(size)}
        return <img
            data-reduced-motion={useReducedMotion}
            data-vibe={enemy.isVibePhraseEnemy}
            className={classes.hit}
            data-guid={enemy.guid}
            onMouseEnter={onHover}
            style={styles}
            height={enemy.height ?? size}
            width={enemy.width ?? size}
            src={enemy.image}
        />
    }
    return <div
        data-reduced-motion={useReducedMotion}
        data-vibe={enemy.isVibePhraseEnemy}
        className={classes.hit}
        data-guid={enemy.guid}
        onMouseEnter={onHover}
        style={{
        ...(enemy.isVibeActive ? {
            backgroundColor: vibeColor,
            border: "0.5px solid black"
        } : {
            backgroundColor: color,
        }),

        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        ...hitStyles,
        
    }} />
}

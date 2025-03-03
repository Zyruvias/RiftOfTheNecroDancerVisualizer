import React from "react"

export const Hit = ({
    offset,
    enemy,
    useEnemyImage = true,
}) => {
    const translate = (size) => `${enemy.transform ?? ""} translate(${Math.round((offset ?? 0) * 50 / size * 100)}%, 0%)`
    const hitStyles = {
        position: "absolute",
        offsetAnchor: "center",
        left: "-2.5px",
        transformOrigin: "center",
        // TODO: ratio of height/width not magic number
        transform: translate(5),
        zIndex: 2,
    } as any
    if (useEnemyImage && enemy.enemyId && enemy.image) {
        const size = 15
        // wyrm edge cases...
        const left = enemy.left ?? `-${size/2}px`
        const bottom = enemy.bottom
        return <img style={{...hitStyles, left, bottom, transform: translate(size)}} height={enemy.height ?? size} width={enemy.width ?? size} src={enemy.image}/>
    }
    return <div style={{
        ...(enemy.isVibeActive ? {
            backgroundColor: "orange",
            borderWidth: "0.25px",
            borderStyle: "solid",
            borderColor: "black",
        } : {
            backgroundColor: "blue",
        }),

        minWidth: "5px",
        minHeight: "5px",
        borderRadius: "50%",
        ...hitStyles,
        
    }} />
}

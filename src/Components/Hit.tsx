import React from "react"

export const Hit = ({
    useImage,
    offset,
    enemy,
    color,
    size,
    vibeColor,
}) => {
    const translate = (size) => `${enemy.transform ?? ""} translate(${Math.round((offset ?? 0) * 50 / size * 100)}%, 0%)`
    const hitStyles = {
        position: "absolute",
        offsetAnchor: "center",
        left: `-${size/2}px`,
        transformOrigin: "center",
        // TODO: ratio of height/width not magic number
        transform: translate(size),
        zIndex: 2,
    } as any
    if (useImage && enemy.enemyId && enemy.image) {
        const size = 20
        // wyrm edge cases...
        const left = enemy.left ?? `-${size/2}px`
        const bottom = enemy.bottom
        return <img style={{...hitStyles, left, bottom, transform: translate(size)}} height={enemy.height ?? size} width={enemy.width ?? size} src={enemy.image}/>
    }
    return <div style={{
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

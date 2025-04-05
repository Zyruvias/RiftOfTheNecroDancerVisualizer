import React, { createContext, forwardRef, ReactElement, useCallback, useEffect, useState } from "react"
import { HoverCard, Portal, Tooltip } from "@mantine/core"

export const PortalTooltipContext = createContext({
    targetId: "",
    setTargetId: (value) => {},
    content: "",
    setContent: (value) => {},
})

export const PortalTooltip = ({ children }) => {


    const [target, setTargetId] = useState<HTMLElement>()
    const [content, setContent] = useState<ReactElement>()

    const bb = target?.getBoundingClientRect()

    useEffect(() => {
        highlightSharedGuidEnemies()
        return removeHighlightFromSharedGuidEnemies
    }, [target])

    // TODO: display logic should not exist here
    const highlightSharedGuidEnemies = useCallback(() => {
        document
            .querySelectorAll(`*[data-guid="${target?.dataset.guid}"]`)
            .forEach(el => el.style.backgroundColor = "yellowgreen")
    }, [target])

    const removeHighlightFromSharedGuidEnemies = () => {
            document
                .querySelectorAll(`*[data-guid]`)
                .forEach(el => el.style.backgroundColor = "rgba(1,1,1,0)")
    }

    return <PortalTooltipContext.Provider value={{ targetId: target, setTargetId, setContent }}>

        <Portal>
            <HoverCard onClose={removeHighlightFromSharedGuidEnemies}>
                <HoverCard.Target>
                    <div
                        style={{
                            position: "fixed",
                            left: bb?.left - bb?.width / 2,
                            top: bb?.top - bb?.height / 2,
                            width: bb?.width * 2,
                            height: bb?.height * 2,
                            offsetAnchor: "bottom",
                            zIndex: 2
                        }}
                    />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    {content}
                </HoverCard.Dropdown>
            </HoverCard>
        </Portal> 
        {children}
    </PortalTooltipContext.Provider>
}
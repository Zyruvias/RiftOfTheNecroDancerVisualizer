import React, { useContext, useState } from "react"
import {
    Button,
    Checkbox,
    Input,
    Stack,
    Modal,
    ColorPicker,
    ColorInput,
    Slider,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { SettingsContext, defaultSettings} from "../SettingsContext"

export const Settings = ({}) => {
    const [opened, { open, close }] = useDisclosure()
    const { options, setOptions } = useContext(SettingsContext)
    const [tempSettings, setTempSettings] = useState(options)

    const setOptionProperty = (prop: keyof typeof defaultSettings, value) => {
        setTempSettings((old) => {
            // console.log("Changing", prop, "to", value)
            return {
                ...old,
                [prop]: value,
            }
        })
    }

    const applySettings = () => {
        setOptions(tempSettings)
    }

    const onClose = () => {
        close()
        applySettings()
    }

    return <>
        <Modal opened={opened} onClose={onClose} title={"Settings"}>
            <Stack gap="sm">
                <Checkbox
                    label={"Show Enemy Images (Beta)"}
                    onChange={(event) => setOptionProperty("showEnemyImages", event.target.checked)}
                    checked={tempSettings.showEnemyImages}
                />
                <Checkbox
                    label={"Show Optimal Vibe Path"}
                    onChange={(event) => setOptionProperty("showVibePath", event.target.checked)}
                    checked={tempSettings.showVibePath}
                />
                <Checkbox
                    label={"Show Beat Number"}
                    onChange={(event) => setOptionProperty("showBeatNumber", event.target.checked)}
                    checked={tempSettings.showBeatNumber}
                />
                {/* <Checkbox
                    label={"Use Reduced Motion for Vibe Phrase Enemies"}
                    onChange={(event) => setOptionProperty("useReducedMotion", event.target.checked)}
                    checked={tempSettings.useReducedMotion}
                /> */}
                <Input.Wrapper
                    label="Hit Size"
                    description={"Used when \"Show Enemy Images\" is disabled"}>
                    <Slider
                        min={5}
                        max={20}
                        step={1}
                        label={tempSettings.hitSplatSize}
                        marks={[
                            {value: 5, label: 5},
                            {value: 20, label: 20}
                        ]}
                        onChange={(value) => setOptionProperty("hitSplatSize", value)}
                    />
                </Input.Wrapper>
                <ColorInput
                    label="Hit Color"
                    description={"Used when \"Show Enemy Images\" is disabled"}
                    value={tempSettings.hitSplatColor}
                    onChange={(value) => setOptionProperty("hitSplatColor", value)}

                />
                <ColorInput
                    label="Vibe Power Hit Color"
                    description={"Used when \"Show Enemy Images\" is disabled and vibe power is active"}
                    value={tempSettings.hitSplatVibeColor}
                    onChange={(value) => setOptionProperty("hitSplatVibeColor", value)}

                    
                />
                <ColorInput
                    label="Vibe Power Shading Color"
                    description={"Used to shade the beats where vibe power is active"}
                    value={tempSettings.vibePowerShadingColor}
                    onChange={(value) => setOptionProperty("vibePowerShadingColor", value)}
                    format="hexa"
                    
                />
                <Button onClick={applySettings}>Apply</Button>
            </Stack>
        </Modal>
        <Button onClick={open}>
            Settings
        </Button>
    </>
}
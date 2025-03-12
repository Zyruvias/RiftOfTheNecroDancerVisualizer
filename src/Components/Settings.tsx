import React, { useContext } from "react"
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

    // TODO: patch real options at close not live
    const setOptionProperty = (prop: keyof typeof defaultSettings, value) => {
        setOptions((old) => {
            console.log("Changing", prop, "to", value)
            return {
                ...old,
                [prop]: value,
            }
        })
    }

    return <>
        <Modal opened={opened} onClose={close} title={"Settings"}>
            <Stack gap="sm">
                <Checkbox
                    label={"Show Enemy Images (Beta)"}
                    onChange={(event) => setOptionProperty("showEnemyImages", event.target.checked)}
                    checked={options.showEnemyImages}
                />
                <Checkbox
                    label={"Show Optimal Vibe Path"}
                    onChange={(event) => setOptionProperty("showVibePath", event.target.checked)}
                    checked={options.showVibePath}
                />
                <Input.Wrapper
                    label="Hit Size"
                    description={"Used when \"Show Enemy Images\" is disabled"}>
                    <Slider
                        min={5}
                        max={20}
                        step={1}
                        label={options.hitSplatSize}
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
                    value={options.hitSplatColor}
                    onChange={(value) => setOptionProperty("hitSplatColor", value)}

                />
                <ColorInput
                    label="Vibe Power Hit Color"
                    description={"Used when \"Show Enemy Images\" is disabled and vibe power is active"}
                    value={options.hitSplatVibeColor}
                    onChange={(value) => setOptionProperty("hitSplatVibeColor", value)}

                    
                />
                <ColorInput
                    label="Vibe Power Shading Color"
                    description={"Used to shade the beats where vibe power is active"}
                    value={options.vibePowerShadingColor}
                    onChange={(value) => setOptionProperty("vibePowerShadingColor", value)}
                    format="hexa"
                    
                />
            </Stack>
        </Modal>
        <Button onClick={open}>
            Settings
        </Button>
    </>
}
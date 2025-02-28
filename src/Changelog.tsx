import React from "react"
import { Button, Modal, Text, Anchor, ModalHeader, List } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

export const Changelog = ({}) => {
    const [opened, { open, close }] = useDisclosure()
    return <>
        <Modal opened={opened} onClose={close} title={"Changelog"}>
            <h3>Version 1.0.0 - Original Release</h3>
            <h4>Feb 28, 2025</h4>
            <List>
                <List.Item>
                    Visualizes of Rift of the NecroDancer Tracks for all difficulties
                </List.Item>
                <List.Item >Visualizes preliminary Optimal Vibe Power Pathing from
                    <Anchor
                        href="https://docs.google.com/spreadsheets/d/1qhnWRmLp0d2X18rmVsK_YJh-CiukE-0Gmg8kBMyYe4A/edit?gid=866842032#gid=866842032">
                        {" Okami's community spreadsheet. "}
                    </Anchor> Missing Rift Within - Impossible as of this first release.
                </List.Item>
            </List>
        </Modal>
        <Button onClick={open}>
            Changelog
        </Button>
    </>
}
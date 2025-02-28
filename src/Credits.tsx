import React from "react"
import { Button, Modal, Text, Anchor, ModalHeader } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

export const Credits = ({}) => {
    const [opened, { open, close }] = useDisclosure()
    return <>
        <Modal opened={opened} onClose={close} title={"Credits"}>
            <Text>App by Zyruvias (@zyruvias)</Text>
            <br></br>
            <Text>Thanks to: Katie for providing hitmaps, raw track data, and assets.</Text>
            <br></br>
            <Text>Okami for Vibe Power{" "}
                <Anchor
                    href="https://docs.google.com/spreadsheets/d/1qhnWRmLp0d2X18rmVsK_YJh-CiukE-0Gmg8kBMyYe4A/edit?gid=866842032#gid=866842032"
                    target="_blank"
                >
                    spreadsheet
                </Anchor>
            </Text>
            <br></br>
            <Text>Rift of the NecroDancer community for Vibe Pathing and feedback for this app</Text>
        </Modal>
        <Button onClick={open}>
            Credits
        </Button>
    </>
}
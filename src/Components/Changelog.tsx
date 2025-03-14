import React from "react"
import { Button, Modal, Stack, Divider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useReleaseNotes } from "../queries"
import { Release } from "./Release"
export const Changelog = ({}) => {
    const [opened, { open, close }] = useDisclosure()

    const releaseNotesQuery = useReleaseNotes()

    return <>
        <Modal opened={opened} onClose={close} title={"Changelog"}>
            <Stack>
                {releaseNotesQuery?.data?.map((release, i) => <>
                    <Release
                        body={release.body}
                        publishedAt={release.published_at}
                        name={release.name}
                        tagName={release.tag_name}
                        />
                    {i !== releaseNotesQuery.data?.length - 1 && <Divider />}
                </>
                )}
            </Stack>
        </Modal>
        <Button onClick={open}>
            Changelog
        </Button>
    </>
}
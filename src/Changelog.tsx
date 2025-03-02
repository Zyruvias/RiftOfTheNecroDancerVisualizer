import React from "react"
import { Button, Modal, Flex, Divider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Release, useReleaseNotes } from "./queries"

export const Changelog = ({}) => {
    const [opened, { open, close }] = useDisclosure()

    const releaseNotesQuery = useReleaseNotes()

    return <>
        <Modal opened={opened} onClose={close} title={"Changelog"}>
            <Flex direction="column-reverse">
                {releaseNotesQuery?.data?.map((release, i) => <>
                    {i !== releaseNotesQuery.data?.length - 1 && <Divider />}
                    <Release
                        body={release.body}
                        publishedAt={release.published_at}
                        name={release.name}
                        tagName={release.tag_name}
                    />
                </>
                )}
            </Flex>
        </Modal>
        <Button onClick={open}>
            Changelog
        </Button>
    </>
}
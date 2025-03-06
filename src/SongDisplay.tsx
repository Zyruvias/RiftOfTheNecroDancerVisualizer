import React from "react"
import { Group, Stack, Image, Text } from "@mantine/core"

export const SongDisplay = ({ trackName, trackAuthor, image  }) => {
  return <Group p="md" justify="end" gap={"lg"}>
    <Stack gap={"lg"} align="end">
      <Image fit="contain" src={image} radius={"md"} width={300} height={300}/>
      <Text>{trackName} by {trackAuthor}</Text>
    </Stack>
  </Group>
}

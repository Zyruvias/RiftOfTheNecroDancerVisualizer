import { Center, Stack } from "@mantine/core"
import React from "react"
import ReactMarkdown from "react-markdown"
export const Release = ({
    body,
    name,
    publishedAt,
    tagName,
}) => {
    return (<Stack>
        <h3>{`${tagName} - ${name}`} </h3>
        <h4>{new Date(publishedAt).toLocaleString()}</h4>
        <ReactMarkdown>{body}</ReactMarkdown>
    </Stack>)
}
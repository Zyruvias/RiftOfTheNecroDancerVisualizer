import React, { useEffect, useState } from "react";
import { Anchor, Button, Center, Group, Select, Stack, Title, Tooltip } from "@mantine/core";
import "@mantine/core/styles.css";
import { TrackDisplay } from "./Components/TrackDisplay";
import { getVibePathForTrackAndDifficulty, useVibePowerPaths } from "./queries";
import { Credits } from "./Components/Credits";
import { Changelog } from "./Components/Changelog";
import { TRACK_LIST, getTrack, getTrackBeatMap } from "./data";
import { SongDisplay } from "./Components/SongDisplay";

const DIFFICULTIES = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Expert", label: "Impossible" },
];

function App() {
  const [track, setTrack] = useState(TRACK_LIST[0]);
  const [trackData, setTrackData] = useState(null);
  const [beatData, setBeatData] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrack(track, difficulty);
      const beatData = await getTrackBeatMap(track, difficulty);
      setBeatData(beatData);
      setTrackData(data);
    };
    fetchData();
  }, [track, difficulty]);

  const vibePowerQuery = useVibePowerPaths();

  const vibePowerDataForTrack = getVibePathForTrackAndDifficulty(
    vibePowerQuery.data,
    track,
    difficulty
  );

  const onTrackChange = async (value, option) => {
    if (!value) {
      return;
    }
    setTrack(option);
  };

  const onDifficultyChange = async (value, option) => {
    if (!value) {
      return;
    }
    setDifficulty(option);
  };
  return (
    <>
      <Center p={"md"}>
        <Title>Rift of the Necrodancer Visualizer</Title>
      </Center>

      <Group justify="center" p={"md"}>
        <Credits />
        <Tooltip label={"Submit feedback on github, or message me on discord (@zyruvias)"}>
          <Button>
            <Anchor
              c="white"
              href="https://github.com/Zyruvias/RiftOfTheNecroDancerVisualizer/issues/new"
              target="_blank"
              >
              Feedback
            </Anchor>
          </Button>
        </Tooltip>
        <Changelog />
        </Group>
      <Center>
        <Stack p={"sm"}>
          <Select
            label="Song Select"
            data={TRACK_LIST}
            value={track.value}
            onChange={onTrackChange}
          />
          <Select
            label="Difficulty Select"
            data={DIFFICULTIES}
            value={difficulty.value}
            onChange={onDifficultyChange}
          />
        </Stack>

        <SongDisplay
          trackName={track.label}
          trackAuthor={track.artist}
          image={track.albumImage}
        />
      </Center>
      <TrackDisplay
        trackData={trackData}
        beatData={beatData}
        vibeData={vibePowerDataForTrack}
      />
    </>
  );
}

export default App;

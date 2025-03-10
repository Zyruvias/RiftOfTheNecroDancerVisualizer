import { Anchor, Button, Center, Group, Select, Tooltip } from "@mantine/core";
import "@mantine/core/styles.css";
import { TRACK_LIST, getTrack, getTrackBeatMap } from "./data/Charts";
import { useEffect, useState } from "react";
import { TrackDisplay } from "./TrackDisplay";
import { getVibePathForTrackAndDifficulty, useVibePowerPaths } from "./queries";
import { Credits } from "./Credits";
import { Changelog } from "./Changelog";

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
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[3]);
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
      <Center>
        <h1>Rift of the Necrodancer Visualizer</h1>
      </Center>
      <Center>
        <Group>
          <div>
            <Select
              label="Song Select"
              data={TRACK_LIST}
              value={track.value}
              onChange={onTrackChange}
            />
          </div>
          <div>
            <Select
              label="Difficulty Select"
              data={DIFFICULTIES}
              value={difficulty.value}
              onChange={onDifficultyChange}
            />
          </div>
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

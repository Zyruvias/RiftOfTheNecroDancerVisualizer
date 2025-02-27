import { Anchor, Button, Center, Group, Select } from "@mantine/core";
import "@mantine/core/styles.css";
import { TRACK_LIST, getTrack, getTrackBeatMap } from "../data/Charts";
import { useEffect, useState } from "react";
import { TrackDisplay } from "./TrackDisplay";
import { getVibePathForTrackAndDifficulty, useVibePowerPaths } from "./queries";
import { Credits } from "./Credits";

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
      <Center>
        <div>
          <h1>Rift of the Necrodancer Optimizer</h1>
        </div>
      </Center>
      <Center>
        <Group>
          <div>
            <h2>Song Select</h2>
            <Select
              data={TRACK_LIST}
              value={track.value}
              onChange={onTrackChange}
            />
          </div>
          <div>
            <h2>Difficulty Select</h2>
            <Select
              data={DIFFICULTIES}
              value={difficulty.value}
              onChange={onDifficultyChange}
            />
          </div>
          <Credits />
          <Anchor component={Button} href={"https://github.com/Zyruvias/RiftOfTheNecroDancerVisualizer/issues/new"}> Feedback</Anchor>
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

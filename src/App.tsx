import React, { useEffect, useState } from "react";
import { Anchor, AppShell, Burger, Button, Center, Group, Select, Stack, Title, Tooltip } from "@mantine/core";
import "@mantine/core/styles.css";
import { TrackDisplay } from "./Components/TrackDisplay";
import {
  TRACK_LIST,
  getTrack,
  getTrackBeatMap,
  getVibePathForTrackAndDifficulty,
  useTrackData,
  useVibePowerPaths
} from "./queries";
import { Credits } from "./Components/Credits";
import { Changelog } from "./Components/Changelog";
import { SongDisplay } from "./Components/SongDisplay";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { defaultSettings, SettingsContext } from "./SettingsContext";
import { Settings } from "./Components/Settings";
import { PortalTooltip } from "./Components/PortalTooltip";


const DIFFICULTIES = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Expert", label: "Impossible" },
];

function App() {
  const [track, setTrack] = useLocalStorage({
    key: 'selectedTrack',
    defaultValue: TRACK_LIST[0]
  });
  const [difficulty, setDifficulty] = useLocalStorage({
    key: 'selectedDifficulty',
    defaultValue: DIFFICULTIES[0]
  });
  const [options, setOptions] = useLocalStorage({
    key: 'applicationSettings',
    defaultValue: defaultSettings
  })
  const [trackData, setTrackData] = useState(null);
  const [beatData, setBeatData] = useState(null);

  const [navbarOpen, { toggle }] = useDisclosure(true)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrack(track, difficulty);
      const beatData = await getTrackBeatMap(track, difficulty);
      setBeatData(beatData);
      setTrackData(data);
    };
    fetchData();
  }, [track, difficulty]);

  const newTrackData = useTrackData(track, difficulty)

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
      <SettingsContext.Provider value={{ options, setOptions }}>
      <PortalTooltip>
        <AppShell
          header={{ height: 48 }}
          navbar={{
            width: 300,
            collapsed: { mobile: !navbarOpen, desktop: !navbarOpen },
            breakpoint: "sm",
          }}
        >

          <AppShell.Header >
            <Group>
              <Burger
                style={{ margin: "auto 0"}}
                p={"sm"}
                opened={navbarOpen}
                onClick={toggle}
              />
                <Title style={{margin: "auto auto"}}>Rift of the Necrodancer Visualizer</Title>
            </Group>
          </AppShell.Header>
          <AppShell.Navbar p={"sm"}>
            <Stack gap={"sm"}>
              <Settings />
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
            </Stack>
          </AppShell.Navbar>
          <AppShell.Main p="xl">
            
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
              hitmapData={newTrackData.data}
              trackData={trackData}
              beatData={beatData}
              vibeData={vibePowerDataForTrack}
            />
          </AppShell.Main>
        </AppShell>
        </PortalTooltip>
      </SettingsContext.Provider>
    </>
  );
}

export default App;

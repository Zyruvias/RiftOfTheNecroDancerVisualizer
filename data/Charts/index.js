// import DiscoDisaster_Impossible from "./Impossible-RhythmRift_DiscoDisaster_Expert.json"
// import DiscoDisaster_Hard from "./Hard-RhythmRift_DiscoDisaster_Hard.json"
// import DiscoDisaster_Medium from "./"
// import DiscoDisaster_Easy from "./"

export const TRACK_LIST = [
    { value: "DiscoDisaster", label: "Disco Disaster" },
    { value: "Elusional", label: "Elusional" },
    { value: "Visualize_Yourself", label: "Visualize Yourself" },
    { value: "Spookhouse Pop", label: "Spookhouse Pop" },
    { value: "Om and On", label: "Om And On" },
    { value: "MorningDove", label: "Morning Dove" },
    { value: "Heph's Mess", label: "Heph's Mess" },
    { value: "Amalgamaniac", label: "Amalgamaniac" },
    { value: "Hang Ten Heph", label: "Hang Ten Heph" },
    { value: "Count_Funkula", label: "Count Funkula" },
    
    { value: "Overthinker", label: "Overthinker" },
    { value: "Cryp2que", label: "Cryp2que" },
    { value: "Nocturning", label: "Nocturning" },
    { value: "Glass Cages", label: "Glass Cages" },
    { value: "Hallow Queen", label: "Hallow Queen" },
    { value: "Progenitor", label: "Progenitor" },
    { value: "Matriarch", label: "Matriarch" },
    { value: "Thunder", label: "Under The Thunder" },
    { value: "Matron", label: "What's In The Box?" },
    { value: "Eldritch_House", label: "Eldritch House" },
    { value: "RAVEvenge", label: "RAVEVENGE" },
    { value: "Rift Within", label: "Rift Within" },
    { value: "Suzus Quest", label: "Suzu's Quest" },
    { value: "Necropolis", label: "Necropolis" },
    { value: "Baboosh", label: "Baboosh" },
    { value: "Necro Sonatica", label: "Necro Sonaetica" },
    { value: "Harmonie", label: "She Banned" },
    { value: "Deep_Blues", label: "King's Ruse" },
    { value: "BraveTheHarvester", label: "Brave The Harvester" },
    { value: "Final_Fugue", label: "Final Fugue" },
    { value: "Twombtorial", label: "Twombtorial" },
    { value: "Portamello", label: "Portamello" },
    { value: "DLCApricot01", label: "Slugger's Refrain" },
    { value: "DLCApricot02", label: "Got Danged" },
    { value: "DLCApricot03", label: "Bootus Bleez" },
    // { value: "", label: "" },

]

// TODO: track files should just be renamed but I got lazy
export const getTrack = async (track, difficulty) => {
    try {
        return await import(`./${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}.json`)
    } catch (e) {
        console.warn(e)
        return await import(`./${difficulty.label}-RhythmRift_${track.value}_${difficulty.value}_DoubleSpeed.json`)
    }
}

export const getTrackBeatMap = async (track, difficulty) => {
    const beatmapName = track.value.replace(/'|_|\s+/g, "")
    
    try {
        const data =  await fetch(`data/HitMaps/all_${difficulty.label.toLowerCase()}/RR${beatmapName}.txt?url`)
        return await data.text()
    } catch (e) {
        console.error(track, difficulty, e)
    }
}
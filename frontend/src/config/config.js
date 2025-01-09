const apiConfig = {
    apiUrl: 'http://localhost:8000',
  };
  
  const artifactConfig = {
    artifactTypes: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
    ],
    mainStatsOptions: {
        1: [{ value: "HP", label: "HP" }],
        2: [{ value: "ATK", label: "ATK" }],
        3: [{ value: "DEF", label: "DEF" }],
        4: [
            { value: "%HP", label: "%HP" },
            { value: "%ATK", label: "%ATK" },
            { value: "%DEF", label: "%DEF" },
            { value: "Crit Rate", label: "Crit Rate" },
            { value: "Crit DMG", label: "Crit DMG" },
            { value: "AP", label: "Anomaly Proficiency" },
        ],
        5: [
            { value: "%HP", label: "%HP" },
            { value: "%ATK", label: "%ATK" },
            { value: "%DEF", label: "%DEF" },
            { value: "PEN Ratio", label: "PEN Ratio" },
            { value: "Physical", label: "Physical" },
            { value: "Electric", label: "Electric" },
            { value: "Ether", label: "Ether" },
            { value: "Fire", label: "Fire" },
            { value: "Ice", label: "Ice" },
        ],
        6: [
            { value: "%HP", label: "%HP" },
            { value: "%ATK", label: "%ATK" },
            { value: "%DEF", label: "%DEF" },
            { value: "AM", label: "Anomaly Mastery" },
            { value: "Impact", label: "Impact" },
            { value: "ER", label: "ER" },
        ],
    },
    allSubstats: ["HP", "%HP", "ATK", "%ATK", "DEF", "%DEF", "PEN", "AP", "Crit Rate", "Crit DMG"],
    scores: ["Complete trash", "Trash", "Usable", "Good", "Excellent", "Marvelous", "Unknown"],
    sources: ["Routine Cleanup", "Music Store"],
    artifactSets: [
        "Astral Voice",
        "Branch & Blade Song",
        "Chaos Jazz",
        "Chaotic Metal",
        "Fanged Metal",
        "Freedom Blues",
        "Hormone Punk",
        "Inferno Metal",
        "Polar Metal",
        "Proto Punk",
        "Puffer Electro",
        "Shockstar Disco",
        "Soul Rock",
        "Swing Jazz",
        "Thunder Metal",
        "Woodpecker Electro"
    ],
  };

  const keysConfig = [
    ["sub_ATK_per", "roll_ATK_per", "added_ATK_per", '%ATK'],
    ["sub_HP_per", "roll_HP_per", "added_HP_per", '%HP'],
    ["sub_DEF_per", "roll_DEF_per", "added_DEF_per", '%DEF'],
    ["sub_ATK", "roll_ATK", "added_ATK", 'ATK'],
    ["sub_HP", "roll_HP", "added_HP", 'HP'],
    ["sub_DEF", "roll_DEF", "added_DEF", 'DEF'],
    ["sub_PEN", "roll_PEN", "added_PEN", 'PEN'],
    ["sub_AP", "roll_AP", "added_AP", 'AP'],
    ["sub_Crit_Rate", "roll_Crit_Rate", "added_Crit_Rate", 'Crit Rate'],
    ["sub_Crit_DMG", "roll_Crit_DMG", "added_Crit_DMG", 'Crit DMG'],
    [null, null, "added_None", "None"]
  ];

  
  export { apiConfig, artifactConfig, keysConfig };
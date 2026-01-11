export interface QueueColumn {
  key: string;
  label: string;
  tooltip: string;
  section?: string;
}

export interface QueueConfig {
  id: string;
  apiBasePath: string;
  storageKey: string;
  kcField: string;
  kcLabel: string;
  columns: QueueColumn[];
  buttonColor: string;
}

export const toaQueueConfig: QueueConfig = {
  id: "toa",
  apiBasePath: "/api/queues/toa-speed",
  storageKey: "toaQueueEntryId",
  kcField: "expertKC",
  kcLabel: "Expert Mode KC",
  columns: [
    { key: "redKeris", label: "Keris", tooltip: "Keris Partisan of Corruption", section: "Gear Check" },
    { key: "bgs", label: "BGS", tooltip: "Bandos Godsword", section: "Gear Check" },
    { key: "zcb", label: "ZCB", tooltip: "Zaryte Crossbow", section: "Gear Check" },
    { key: "eye", label: "Eye", tooltip: "Eye of Ayak", section: "Gear Check" },
  ],
  buttonColor: "yellow",
};

export const tobQueueConfig: QueueConfig = {
  id: "tob",
  apiBasePath: "/api/queues/tob-speed",
  storageKey: "tobQueueEntryId",
  kcField: "kc",
  kcLabel: "ToB KC",
  columns: [
    { key: "scythe", label: "Scythe", tooltip: "Scythe of Vitur", section: "Gear Check" },
    { key: "needs4Man", label: "4-Man", tooltip: "Need 4-Man GM Time", section: "Which times do you need?" },
    { key: "needs5Man", label: "5-Man", tooltip: "Need 5-Man GM Time", section: "Which times do you need?" },
  ],
  buttonColor: "red",
};

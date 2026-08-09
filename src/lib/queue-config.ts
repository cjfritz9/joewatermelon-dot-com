export interface QueueColumn {
  key: string;
  label: string;
  tooltip: string;
  section?: string;
}

export interface QueueConfig {
  id: string;
  apiBasePath: string;
  collectionName: string;
  storageKey: string;
  kcField: string;
  kcLabel: string;
  kcDescription?: string;
  columns: QueueColumn[];
  buttonColor: string;
}

export const toaQueueConfig: QueueConfig = {
  id: "toa",
  apiBasePath: "/api/queues/toa-speed",
  collectionName: "toa-queue",
  storageKey: "toaQueueEntryId",
  kcField: "expertKC",
  kcLabel: "Expert Mode KC",
  kcDescription: "Combined across all your accounts",
  columns: [
    {
      key: "redKeris",
      label: "Keris",
      tooltip: "Keris Partisan of Corruption",
      section: "Gear Check",
    },
    {
      key: "shadow",
      label: "Shadow",
      tooltip: "Tumeken's Shadow",
      section: "Gear Check",
    },
    {
      key: "zcb",
      label: "ZCB",
      tooltip: "Zaryte Crossbow",
      section: "Gear Check",
    },
    { key: "eye", label: "Eye", tooltip: "Eye of Ayak", section: "Gear Check" },
  ],
  buttonColor: "yellow",
};

export const tobQueueConfig: QueueConfig = {
  id: "tob",
  apiBasePath: "/api/queues/tob-speed",
  collectionName: "tob-queue",
  storageKey: "tobQueueEntryId",
  kcField: "kc",
  kcLabel: "ToB KC",
  columns: [
    {
      key: "scythe",
      label: "Scythe",
      tooltip: "Scythe of Vitur",
      section: "Gear Check",
    },
    {
      key: "whip",
      label: "Whip",
      tooltip: "Tentacle Whip",
      section: "Gear Check",
    },
    {
      key: "saeldor",
      label: "Blade",
      tooltip: "Blade of Saeldor",
      section: "Gear Check",
    },
    {
      key: "reaperAxe",
      label: "SRA",
      tooltip: "Soul Reaper Axe",
      section: "Gear Check",
    },
    {
      key: "halberd",
      label: "Halberd",
      tooltip: "Noxious Halberd",
      section: "Gear Check",
    },
    {
      key: "needs4Man",
      label: "4-Man",
      tooltip: "Need 4-Man GM Time",
      section: "Which times do you need?",
    },
    {
      key: "needs5Man",
      label: "5-Man",
      tooltip: "Need 5-Man GM Time",
      section: "Which times do you need?",
    },
  ],
  buttonColor: "red",
};

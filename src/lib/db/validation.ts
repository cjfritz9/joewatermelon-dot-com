export const getToaQueueEntryIsValid = (body: any) => {
  if (typeof body !== "object" || !body) {
    return false;
  }

  const requiredFields = [
    "twitchUsername",
    "rsn",
    "expertKC",
    "ready",
    "redKeris",
    "bgs",
    "notes",
    "zcb",
  ];

  return requiredFields.every((field) => field in body);
};

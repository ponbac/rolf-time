export const APP_URL = (): string =>
  window.location.host == "localhost:5173"
    ? "http://localhost:5173"
    : "https://england.backman.app";

export const GROUPS = ["A", "B", "C", "D"];

// TODO: This is a hack, but it works for now (should be server-side).
export const GROUP_PREDICTIONS_CLOSE = "2022-07-07T23:00:00";
//export const PLAYOFF_PREDICTIONS_OPEN = "2022-07-16T12:00:00";
export const PLAYOFF_PREDICTIONS_OPEN = "2022-07-18T23:00:00";
export const PLAYOFF_PREDICTIONS_CLOSE = "2022-07-20T21:00:00";

export const ADMIN_ID = "b0833ff0-5938-4355-b940-8c92ec1088cb";

export const TBD_TEAM: Team = {
  id: -1,
  name: "TBD",
  flagCode: "aq",
  groupId: "TBD",
  points: 0,
};

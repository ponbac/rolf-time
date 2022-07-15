export const APP_URL = (): string =>
  window.location.host == "localhost:5173"
    ? "http://localhost:5173"
    : "https://england.backman.app";

export const GROUPS = ["A", "B", "C", "D"];
export const PREDICTIONS_OPEN_UNTIL = "2022-07-07T23:00:00";
export const ADMIN_ID = "b0833ff0-5938-4355-b940-8c92ec1088cb";
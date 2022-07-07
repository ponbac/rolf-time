export const APP_URL = (): string =>
  window.location.host == "localhost:3000"
    ? "http://localhost:3000"
    : "https://england.backman.app";

export const PREDICTIONS_OPEN_UNTIL = "2022-07-07T14:00:00";

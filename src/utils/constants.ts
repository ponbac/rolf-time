export const APP_URL = (): string =>
  window.location.host == "localhost:3000"
    ? "http://localhost:3000"
    : "https://england.backman.app";

export const PREDICTIONS_OPEN_UNTIL = "2022-07-07T14:00:00";
export const ADMIN_ID = "b0833ff0-5938-4355-b940-8c92ec1088cb";
const APP_URL = (): string =>
  window.location.host == "localhost:3000" ? "http://localhost:3000" : "https://england.backman.app";

  export { APP_URL };

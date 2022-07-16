import { useState, useEffect } from "react";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { sleep };

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export const findPrediction = (
  game: Game,
  userPredictions: GroupPrediction[]
) => {
  const group = userPredictions.find((p) => p.groupId === game.groupId);
  if (group) {
    const prediction = group.games.find((p) => p.id === game.id);
    if (prediction) {
      return prediction;
    }
  }
};

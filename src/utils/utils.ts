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
  if (game) {
    const group = userPredictions.find((p) => p.groupId === game.groupId);
    if (group) {
      const prediction = group.games.find((p) => p.id === game.id);
      if (prediction) {
        return prediction;
      }
    }
  }

  return undefined;
};

export const calcSemifinals = (quarters: Game[], predictions: GroupPrediction[]) => {
  const teamOneId = findPrediction(quarters[0], predictions)?.winner;
  const teamTwoId = findPrediction(quarters[2], predictions)?.winner;
  const teamThreeId = findPrediction(quarters[1], predictions)?.winner;
  const teamFourId = findPrediction(quarters[3], predictions)?.winner;

  if (
    teamOneId == -1 ||
    teamTwoId == -1 ||
    teamThreeId == -1 ||
    teamFourId == -1
  ) {
    return [];
  }

  if (
    teamOneId != undefined &&
    teamTwoId != undefined &&
    teamThreeId != undefined &&
    teamFourId != undefined
  ) {
    const teamOne =
      quarters[0].homeTeam?.id == teamOneId
        ? quarters[0].homeTeam
        : quarters[0].awayTeam;
    const teamTwo =
      quarters[2].homeTeam?.id == teamTwoId
        ? quarters[2].homeTeam
        : quarters[2].awayTeam;
    const teamThree =
      quarters[1].homeTeam?.id == teamThreeId
        ? quarters[1].homeTeam
        : quarters[1].awayTeam;
    const teamFour =
      quarters[3].homeTeam?.id == teamFourId
        ? quarters[3].homeTeam
        : quarters[3].awayTeam;

    const semifinalOne: Game = {
      id: quarters[3].id + 1,
      date: "2022-07-26T21:00:00",
      homeTeam: teamOne,
      awayTeam: teamTwo,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "SEMIS",
    };
    const semifinalTwo: Game = {
      id: quarters[3].id + 2,
      date: "2022-07-27T21:00:00",
      homeTeam: teamThree,
      awayTeam: teamFour,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "SEMIS",
    };

    return [semifinalOne, semifinalTwo];
  }

  return [];
};

export const calcFinal = (semis: Game[], predictions: GroupPrediction[]) => {
  const teamOneId = findPrediction(semis[0], predictions)?.winner;
  const teamTwoId = findPrediction(semis[1], predictions)?.winner;

  if (teamOneId == -1 || teamTwoId == -1) {
    return [];
  }

  if (teamOneId != undefined && teamTwoId != undefined) {
    const teamOne =
      semis[0].homeTeam?.id == teamOneId
        ? semis[0].homeTeam
        : semis[0].awayTeam;
    const teamTwo =
      semis[1].homeTeam?.id == teamTwoId
        ? semis[1].homeTeam
        : semis[1].awayTeam;

    const final: Game = {
      id: semis[1].id + 1,
      date: "2022-07-31T18:00:00",
      homeTeam: teamOne,
      awayTeam: teamTwo,
      homeGoals: 0,
      awayGoals: 0,
      finished: false,
      winner: -1,
      groupId: "FINAL",
    };

    return [final];
  }

  return [];
};
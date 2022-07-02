type Group = {
  id: string;
  teams: Team[];
  games: Game[];
};

type Team = {
  id: number;
  name: string;
  flagCode: string;
  groupId: string;
  points: number;
};

type Game = {
  id: number;
  finished: boolean;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  date: string;
  groupId: string;
  winner: number;
};

type PlayerUser = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  score: number;
  predictions: GroupPrediction[];
};

type GamePrediction = {
  id: number;
  homeGoals: number;
  awayGoals: number;
  winner: number;
};

type GroupPrediction = {
  groupId: string;
  games: GamePrediction[];
  result: Team[4];
};

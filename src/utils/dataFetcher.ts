import { createClient, User } from "@supabase/supabase-js";
import useSWR, { Fetcher } from "swr";

const API_URL = "/api";
const SUPABASE = createClient(
  "https://nyejtzmcirmhxxojkvgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWp0em1jaXJtaHh4b2prdmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3NTI4OTksImV4cCI6MTk3MjMyODg5OX0.u_7BlAWSwxPTFXOhelBkpvAx77lS9wXBL7_IBNZB_9M",
  {
    schema: "public",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
);
const FETCHER = (url: RequestInfo) => fetch(url).then((r) => r.json());

// const useGroups = (): {
//   groups: Group[] | undefined;
//   isLoading: boolean;
//   isError: Error;
// } => {
//   const { data, error } = useSWR<Group[]>("/api/groups", FETCHER);

//   return { groups: data, isLoading: !error && !data, isError: error };
// };

const fetchGroups = async (): Promise<Group[]> => {
  const groupNames = ["A", "B", "C", "D"];
  let groups: Group[] = [];

  await Promise.all(
    groupNames.map(async (groupName) => {
      const g = await fetchGroup(groupName);
      groups.push(g);
    })
  );

  return groups.sort((a, b) => a.id.localeCompare(b.id));
};

const fetchGroup = async (groupId: string): Promise<Group> => {
  let group: Group = {
    id: groupId.toUpperCase(),
    teams: [],
    games: [],
  };

  // TODO: Don't fetch teams here, still fetches them multiple times from the games...
  const { data: teams, error: teamsError } = await SUPABASE.from("teams")
    .select()
    .eq("groupId", groupId.toUpperCase());
  if (teamsError) {
    throw new Error(teamsError.message);
  }
  group.teams = teams;

  const { data: games, error: gamesError } = await SUPABASE.from("games")
    .select(
      `
    id,
    finished,
    homeGoals,
    awayGoals,
    homeTeam: homeTeam ( id, name, flagCode, groupId ),
    awayTeam: awayTeam ( id, name, flagCode, groupId ),
    date,
    groupId
    `
    )
    .eq("groupId", groupId.toUpperCase());
  if (gamesError) {
    throw new Error(gamesError.message);
  }
  group.games = games;

  return group;
};

const fetchAllTeams = async (): Promise<Team[]> => {
  const response = await fetch(`${API_URL}/teams`);
  const data = await response.json();
  return data;
};

const fetchTeam = async (teamId?: string, teamName?: string): Promise<Team> => {
  let query = "";
  if (teamId) {
    query = `id=${teamId}`;
  } else if (teamName) {
    query = `name=${teamName}`;
  } else {
    throw new Error("Team id or name must be provided");
  }

  const response = await fetch(`${API_URL}/teams?${query}`);
  const data = await response.json();
  return data;
};

// const useGames = (): {
//   games: Game[] | undefined;
//   isLoading: boolean;
//   isError: Error;
// } => {
//   const { data, error } = useSWR<Game[]>("/api/games", FETCHER);

//   return { games: data, isLoading: !error && !data, isError: error };
// };

const fetchGames = async (): Promise<Game[]> => {
  const { data, error } = await SUPABASE.from("games").select(
    `
    id,
    finished,
    homeGoals,
    awayGoals,
    homeTeam: homeTeam ( id, name, flagCode, groupId ),
    awayTeam: awayTeam ( id, name, flagCode, groupId ),
    date,
    groupId
    `
  );
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getCurrentUser = (): User | null => {
  const user = SUPABASE.auth.user();

  return user;
};

const isLoggedIn = (): boolean => {
  const user = SUPABASE.auth.user();

  return user ? true : false;
};

const fetchUser = async (userId: string): Promise<any> => {
  const { data, error } = await SUPABASE.from("users")
    .select()
    .eq("id", userId);
  if (error) {
    throw new Error(error.message);
  }

  let user = data[0];
  if (user.predictions != null) {
    user.predictions = JSON.parse(user.predictions);
  }

  return user;
};

const fetchAllUsers = async (): Promise<any> => {
  const { data, error } = await SUPABASE.from("users").select();
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateUserData = async (
  userId: string,
  name: string,
  avatar: string,
  description: string
): Promise<any> => {
  const { data, error } = await SUPABASE.from("users")
    .update({ name: name, avatar: avatar, description: description })
    .match({ id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateUserPredictions = async (
  userId: string,
  predictions: GroupPrediction[]
): Promise<any> => {
  const predictionsJson = JSON.stringify(predictions);
  //console.log(predictionsJson);

  const { data, error } = await SUPABASE.from("users")
    .update({ predictions: predictionsJson })
    .match({ id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const fetchPredictions = async (userId: string): Promise<GroupPrediction[]> => {
  const { data, error } = await SUPABASE.from("users")
    .select(
      `
    predictions
    `
    )
    .match({ id: userId });
  if (error) {
    throw new Error(error.message);
  }

  const parsedPredictions = JSON.parse(data[0].predictions);
  console.log(parsedPredictions);

  return parsedPredictions;
};

export {
  SUPABASE,
  fetchGroup,
  fetchGroups,
  fetchGames,
  getCurrentUser,
  fetchUser,
  fetchAllUsers,
  fetchPredictions,
  updateUserData,
  updateUserPredictions,
  isLoggedIn,
};

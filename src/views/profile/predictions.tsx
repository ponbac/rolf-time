import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchGames,
  fetchGroupResults,
  fetchUser,
} from "../../utils/dataFetcher";
import TeamFlag from "../../components/TeamFlag";
import { TeamBlock } from "../predict/[groupId]";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useQuery } from "react-query";
import { TBD_TEAM } from "../../utils/constants";
import { calcFinal, calcSemifinals } from "../../utils/utils";
import CollapsibleContainer from "../../components/CollapsibleContainer";

type PredictedGroupProps = {
  groupName: string;
  teams: Team[];
  result: number[] | undefined;
};
const PredictedGroup = (props: PredictedGroupProps) => {
  const { teams, result, groupName } = props;

  const TeamItem = (props: { team: Team; placing: number }) => {
    const { team, placing } = props;

    const correctPlacing = () => {
      if (result) {
        if (result[placing - 1] == team.id) {
          return true;
        }
      }
      return false;
    };

    return (
      <div
        className={`${
          correctPlacing() ? "bg-green-500/50" : "bg-gray-400/30"
        } gap-2 w-[17rem] mx-2 flex flex-row items-center font-novaMono backdrop-blur-sm py-2 px-4 rounded-lg`}
      >
        <p className={"font-bold"}>{placing}.</p>
        <TeamFlag team={team} width="2.0rem" />
        <p className="font-bold">{team.name}</p>
        {correctPlacing() && (
          <p className="font-bold flex flex-1 justify-end">+3</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-bold font-novaMono">Group {groupName}</p>
      <div className="pt-2 space-y-1">
        {teams.map((team, placing) => (
          <TeamItem team={team} placing={placing + 1} key={team.name} />
        ))}
      </div>
    </div>
  );
};

type PredictedGamesProps = {
  predictions: GroupPrediction[];
};
const PredictedGames = (props: PredictedGamesProps) => {
  const { predictions } = props;
  const { data: games } = useQuery("games", fetchGames);
  const [predictedGames, setPredictedGames] = useState<Game[]>([]);

  const parseName = (groupName: string) => {
    if (groupName.length == 1) {
      return "Group " + groupName;
    } else if (groupName == "QUARTERS") {
      return "Quarterfinals";
    } else if (groupName == "SEMIS") {
      return "Semifinals";
    } else if (groupName == "FINAL") {
      return "Final";
    }
  };

  // Calculates semis and final based on quarters predictions
  useEffect(() => {
    if (games) {
      const quarters = games
        .filter((game) => game.groupId === "QUARTERS")
        .sort((a, b) => a.date.localeCompare(b.date));
      const semis = calcSemifinals(quarters, predictions);
      const final = calcFinal(semis, predictions);

      setPredictedGames(
        games
          .filter((game) => game.groupId != "SEMIS" && game.groupId != "FINAL")
          .concat(semis, final)
      );
    }
  }, [games]);

  if (!games) {
    return <LoadingIndicator />;
  }

  const PredictionItem = (props: {
    prediction: GamePrediction;
    key: string;
  }) => {
    const { prediction } = props;
    let game = predictedGames.find((g) => g.id === props.prediction.id);
    let playedGame = games.find((g) => g.id === props.prediction.id);

    const [pointsText, setPointsText] = useState<string>("");
    const [pointsStyle, setPointsStyle] = useState<string>("");

    if (!game) {
      return null;
    }

    if (game.homeTeam === null) {
      game.homeTeam = TBD_TEAM;
    }
    if (game.awayTeam === null) {
      game.awayTeam = TBD_TEAM;
    }

    if (playedGame) {
      playedGame.winner = playedGame.winner == null ? -1 : playedGame.winner;
    }
    const correctPrediction = prediction.winner == playedGame?.winner;
    const correctScore =
      prediction.homeGoals == playedGame?.homeGoals &&
      prediction.awayGoals == playedGame?.awayGoals;

    const resultTextColor = () => {
      if (correctScore && correctPrediction) {
        return "text-blue-400";
      } else if (correctPrediction) {
        return "text-green-400";
      } else {
        return "text-red-500";
      }
    };
    // TODO: should probably have point reward amounts in the database
    const resultPoints = () => {
      let points = 0;
      if (correctPrediction) {
        if (playedGame?.groupId == "QUARTERS") {
          points = 6;
        } else if (playedGame?.groupId == "SEMIS") {
          points = 8;
        } else if (playedGame?.groupId == "FINAL") {
          points = 10;
        } else {
          points = 3;
        }

        if (correctScore) {
          if ((playedGame?.groupId.length ?? 0) > 1) {
            points += 3;
          } else {
            points += 1;
          }
        }
      }

      return points == 0 ? "" : `+${points}`;
    };

    useEffect(() => {
      setPointsText(resultPoints());
      setPointsStyle(resultTextColor());
    }, [playedGame]);

    return (
      <Link to={`/game/${game.id}`}>
        <div className="p-2 hover:bg-gray-700/70 rounded-xl transition-all font-novaMono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-6 lg:mb-0">
          <TeamBlock
            team={game.homeTeam}
            away={false}
            selected={game.homeTeam.id == prediction.winner}
          />
          <div className="flex flex-col text-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">
                {prediction.homeGoals} - {prediction.awayGoals}
              </p>
              {playedGame?.finished && (
                <p className={"text-sm " + pointsStyle}>
                  ({playedGame.homeGoals} - {playedGame.awayGoals}) {pointsText}
                </p>
              )}
            </div>
          </div>
          <TeamBlock
            team={game.awayTeam}
            away={true}
            selected={game.awayTeam.id == prediction.winner}
          />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="py-2 space-y-5">
        {predictions.map((p) => (
          <CollapsibleContainer
            title={parseName(p.groupId) ?? ""}
            open={false}
            key={p.groupId}
          >
            <div className="flex flex-col justify-center items-center">
              {p.games.map((gamePrediction) => (
                <PredictionItem
                  prediction={gamePrediction}
                  key={gamePrediction.id.toString()}
                />
              ))}
            </div>
          </CollapsibleContainer>
        ))}
      </div>
    </div>
  );
};

/*
TODO: Make sections collapsable
*/
const UserPredictions = () => {
  let params = useParams();
  const id = params.id;

  const [predictions, setPredictions] = useState<GroupPrediction[]>();
  const [user, setUser] = useState<PlayerUser>();
  const { data: groupResults } = useQuery("groupResults", fetchGroupResults);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id != undefined) {
      fetchUser(id as string).then((u) => {
        setUser(u);
        if (u.predictions != undefined && u.predictions.length > 0) {
          setPredictions(u.predictions);
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  if (!id) {
    return (
      <div className="font-novaMono flex flex-row items-center justify-center">
        No user ID!
      </div>
    );
  }

  if (isLoading) {
    return <LoadingIndicator fullscreen={true} />;
  }

  if (!isLoading && predictions == undefined) {
    return (
      <div className="font-novaMono flex flex-row items-center justify-center min-h-screen text-4xl">
        This user has no predictions saved!
      </div>
    );
  }

  return (
    <div className="min-h-screen font-novaMono flex flex-col items-center justify-center my-6">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-7xl font-bold font-novaMono pb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {user?.name}
          </p>
          <p className="text-4xl font-bold font-novaMono italic">
            {user?.score}p
          </p>
        </div>
        {predictions && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-12 mt-8">
              {predictions.map((p) => {
                // then it's not a group
                if (p.groupId.length > 1) {
                  return null;
                }

                return (
                  <PredictedGroup
                    groupName={p.groupId}
                    teams={p.result}
                    result={
                      groupResults?.find((g) => g.id === p.groupId)?.results
                    }
                    key={p.groupId}
                  />
                );
              })}
            </div>
            <div className="flex flex-col justify-center items-center pt-8">
              <h1 className="text-5xl font-bold mb-2">Games</h1>
              <PredictedGames predictions={predictions} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserPredictions;

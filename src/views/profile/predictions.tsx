import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { fetchGames, fetchUser } from "../../utils/dataFetcher";
import TeamFlag from "../../components/TeamFlag";
import { TeamBlock } from "../predict/[groupId]";
import LoadingIndicator from "../../components/LoadingIndicator";

type PredictedGroupProps = {
  groupName: string;
  teams: Team[];
};
const PredictedGroup = (props: PredictedGroupProps) => {
  const { teams, groupName } = props;

  const TeamItem = (props: { team: Team; placing: number; key: string }) => {
    return (
      <div className="gap-2 w-64 hover:bg-primary/30 transition-all mx-2 flex flex-row items-center font-novaMono bg-gray-400/30 backdrop-blur-sm py-2 px-4 rounded-lg">
        <p className={"font-bold"}>{props.placing}.</p>
        <TeamFlag team={props.team} width="2.0rem" />
        <h1 className="font-bold">{props.team.name}</h1>
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
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames().then((games) => {
      if (games) {
        setGames(games);
      }
    });
  }, []);

  const PredictionItem = (props: {
    prediction: GamePrediction;
    key: string;
  }) => {
    const { prediction } = props;
    const game = games.find((g) => g.id === props.prediction.id);

    if (!game) {
      return null;
    }

    const correctPrediction = prediction.winner == game.winner;
    const correctScore =
      prediction.homeGoals == game.homeGoals &&
      prediction.awayGoals == game.awayGoals;
    const resultTextColor = () => {
      if (correctScore) {
        return "text-blue-400";
      } else if (correctPrediction) {
        return "text-green-400";
      } else {
        return "text-red-500";
      }
    };

    return (
      <Link to={`/game/${game.id}`}>
        <div className="p-2 hover:bg-gray-700/70 rounded-xl transition-all font-novaMono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
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
              {game.finished && (
                <p className={"text-sm " + resultTextColor()}>
                  ({game.homeGoals} - {game.awayGoals}){" "}
                  {correctScore ? "+4" : correctPrediction ? "+3" : ""}
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
      <div className="py-2 space-y-8">
        {predictions.map((p) => (
          <div
            className="flex flex-col  justify-center items-center"
            key={p.groupId}
          >
            <p className="text-3xl font-bold font-novaMono">Group {p.groupId}</p>
            {p.games.map((gamePrediction) => (
              <PredictionItem
                prediction={gamePrediction}
                key={gamePrediction.id.toString()}
              />
            ))}
          </div>
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
        className=""
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 my-6">
              {predictions.map((p) => (
                <PredictedGroup
                  groupName={p.groupId}
                  teams={p.result}
                  key={p.groupId}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center items-center pt-8">
              <PredictedGames predictions={predictions} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserPredictions;

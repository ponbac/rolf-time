import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import TeamFlag from "../../components/TeamFlag";
import { fetchGroup } from "../../utils/dataFetcher";
import { useAppDispatch, useAppSelector } from "../../utils/store";
import {
  predictGame,
  savePredictions,
  selectPredictions,
} from "../../features/predict/predictSlice";
import { GROUP_PREDICTIONS_CLOSE, TBD_TEAM } from "../../utils/constants";
import LoadingIndicator from "../../components/LoadingIndicator";

export const TeamBlock: FC<{
  team: Team;
  away: boolean;
  selected: boolean;
}> = ({ team, away, selected }) => {
  const flagWidth = "2.25rem";

  return (
    <div
      className={
        "gap-2 bg-gray-400/30 backdrop-blur-sm py-2 px-4 flex flex-row items-center justify-between w-72 p-4 rounded-xl transition-all " +
        (selected == true ? "bg-green-600/60" : "")
      }
    >
      {away && (
        <>
          <TeamFlag team={team} width={flagWidth} />
          <p className="text-xl font-bold">{team.name}</p>
        </>
      )}
      {!away && (
        <>
          <p className="text-xl font-bold">{team.name}</p>
          <TeamFlag team={team} width={flagWidth} />
        </>
      )}
    </div>
  );
};

type GameBlockProps = {
  game: Game;
};
export const GameBlock = (props: GameBlockProps) => {
  let { game } = props;

  if (game.homeTeam === null) {
    game.homeTeam = TBD_TEAM;
  }
  if (game.awayTeam === null) {
    game.awayTeam = TBD_TEAM;
  }

  let date = moment(game.date).format("dddd DD/MM, HH:mm");

  const predictions = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();

  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);

  type GoalButtonProps = {
    awayTeam?: boolean;
  };
  const AddButton = (props: GoalButtonProps) => {
    return (
      <button
        className="bg-green-600/60 hover:bg-green-500 text-white font-bold px-2 rounded-full transition-all"
        onClick={() => {
          if (props.awayTeam) {
            setAwayGoals(awayGoals + 1);
          } else {
            setHomeGoals(homeGoals + 1);
          }
        }}
      >
        +
      </button>
    );
  };
  const MinusButton = (props: GoalButtonProps) => {
    return (
      <button
        className="bg-red-600/60 hover:bg-red-500 text-white font-bold px-2 rounded-full transition-all"
        onClick={() => {
          if (props.awayTeam) {
            if (awayGoals > 0) {
              setAwayGoals(awayGoals - 1);
            }
          } else {
            if (homeGoals > 0) {
              setHomeGoals(homeGoals - 1);
            }
          }
        }}
      >
        -
      </button>
    );
  };

  useEffect(() => {
    if (homeGoals > awayGoals) {
      setSelectedTeam(game.homeTeam);
    } else if (awayGoals > homeGoals) {
      setSelectedTeam(game.awayTeam);
    } else {
      setSelectedTeam(undefined);
    }

    let winner: number =
      homeGoals > awayGoals ? game.homeTeam.id : game.awayTeam.id;
    if (homeGoals === awayGoals) {
      winner = -1;
    }

    console.log(winner)

    dispatch(
      predictGame({
        groupId: game.groupId,
        gamePrediction: {
          id: game.id,
          homeGoals: homeGoals,
          awayGoals: awayGoals,
          winner: winner,
        },
      })
    );
  }, [homeGoals, awayGoals]);

  useEffect(() => {
    // Show saved predictions as presets if they exist
    const groupPrediction = predictions.find(
      (g) => g.groupId === game.groupId.toUpperCase()
    );
    if (groupPrediction) {
      const gamePrediction = groupPrediction.games.find(
        (g) => g.id === game.id
      );
      if (gamePrediction) {
        setHomeGoals(gamePrediction.homeGoals);
        setAwayGoals(gamePrediction.awayGoals);
      }
    }
  }, []);

  return (
    <div className="font-novaMono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
      <TeamBlock
        team={game.homeTeam}
        away={false}
        selected={game.homeTeam.id == selectedTeam?.id}
      />
      <div className="flex flex-col text-center">
        <div className="flex flex-row items-center justify-center">
          <div className="mr-4 space-x-2">
            <MinusButton />
            <AddButton />
          </div>

          <p className="text-2xl font-bold">
            {homeGoals} - {awayGoals}
          </p>
          <div className="ml-4 space-x-2">
            <AddButton awayTeam={true} />
            <MinusButton awayTeam={true} />
          </div>
        </div>
        <p className="text-xs italic">{date}</p>
      </div>
      <TeamBlock
        team={game.awayTeam}
        away={true}
        selected={game.awayTeam.id == selectedTeam?.id}
      />
    </div>
  );
};

const GroupBlock: FC<{}> = ({}) => {
  let params = useParams();
  const id = params.id;

  const [group, setGroup] = useState<Group>();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const nextGroupId = (): string => {
    const index = groupOrder.indexOf((id as string).toUpperCase());
    if (index == -1) {
      return "";
    }
    return groupOrder[index + 1];
  };

  // TODO: This should be server-side hehe (and implemented completely differently)
  const [predictionsClosed, setPredictionsClosed] = useState<boolean>(false);

  useEffect(() => {
    const currentTime = moment();
    if (currentTime.isAfter(GROUP_PREDICTIONS_CLOSE)) {
      setPredictionsClosed(true);
    }
  }, []);

  useEffect(() => {
    if (id != undefined) {
      setIsLoading(true);
      fetchGroup(id as string).then((group) => {
        setGroup(group);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (predictionsClosed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-3">
        <h1 className="text-4xl font-bold font-novaMono">
          Predictions are currently closed!
        </h1>
        <h2 className="text-sm font-novaMono">
          Bracket stage predictions will open after the group stage is finished.
        </h2>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="font-novaMono flex flex-row items-center justify-center">
        No group ID provided!
      </div>
    );
  }

  if (isLoading) {
    return <LoadingIndicator fullscreen={true} />;
  }

  return (
    <div className="min-h-screen font-novaMono flex flex-col items-center justify-center my-6">
      <motion.div
        className="flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
        key={group?.id}
      >
        <h1 className="text-4xl font-bold" key={"header-" + group?.id}>
          Group {(id as string).toUpperCase()}
        </h1>
        {group &&
          group.games
            ?.sort((a, b) => a.date.localeCompare(b.date))
            .map((game) => <GameBlock key={game.id} game={game} />)}
        <Link
          to={
            (id as string).toUpperCase() === "D"
              ? "/"
              : `/predict/group/${nextGroupId()}`
          }
          onClick={() => {
            //if ((id as string).toUpperCase() === "H") {
            dispatch(savePredictions());
            //}
          }}
        >
          <div className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold">
            {(id as string).toUpperCase() === "D" ? "Save" : "Next Group"}
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default GroupBlock;

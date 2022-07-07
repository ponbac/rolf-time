import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReorderableGroup from "../../components/ReorderableGroup";
import { savePredictions } from "../../features/predict/predictSlice";
import { fetchGroups } from "../../utils/dataFetcher";
import { useAppDispatch } from "../../utils/store";

const Predict: React.FC<{}> = () => {
  //const { groups, isLoading, isError } = useGroups();
  const [groups, setGroups] = useState<Group[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO: This should be server-side hehe (and implemented completely differently)
  const [predictionsClosed, setPredictionsClosed] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = moment();
    if (currentTime.isAfter("2022-07-07T20:00:00")) {
      setPredictionsClosed(true);
    }

    setIsLoading(true);
    fetchGroups().then((g) => {
      setGroups(g);
      setIsLoading(false);
    });
  }, []);

  if (predictionsClosed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-3">
        <h1 className="text-4xl font-bold font-mono">Predictions are currently closed!</h1>
        <h2 className="text-sm font-mono">Bracket stage predictions will open after the group stage is finished.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-indicator">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 my-6">
        {groups &&
          groups.map((group) => (
            <ReorderableGroup key={group.id} group={group} />
          ))}
      </div>
      <Link to="/predict/group/a">
        <button
          className="mb-6 hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold"
          onClick={() => {
            dispatch(savePredictions());
          }}
        >
          Games &#8594;
        </button>
      </Link>
    </motion.div>
  );
};

export default Predict;

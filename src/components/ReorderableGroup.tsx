import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { predictGroup, selectPredictions } from "../features/predict/predictSlice";
import { useAppDispatch, useAppSelector } from "../utils/store";
import TeamFlag from "./TeamFlag";

const GroupItem: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div className="gap-2 w-52 hover:cursor-pointer hover:bg-primary/30 transition-all mx-2 flex flex-row items-center font-mono bg-gray-400/30 backdrop-blur-sm py-2 px-4 rounded-lg">
      <TeamFlag team={team} width="2.0rem" />
      <h1>{team.name}</h1>
    </div>
  );
};

const ReorderableGroup: React.FC<{ group: Group }> = ({ group }) => {
  const [groupItem, setGroup] = useState<Team[]>(group.teams);
  const predictions = useAppSelector(selectPredictions);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (predictions.length > 0) {
      setGroup(predictions.find(p => p.groupId === group.id)?.result);
    }
  }, []);

  useEffect(() => {
    dispatch(predictGroup({ groupId: group.id, prediction: groupItem }));
  }, [groupItem]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold font-mono">Group {group.id}</p>
      <Reorder.Group
        axis="y"
        values={groupItem}
        onReorder={setGroup}
        className="pt-2 space-y-1"
      >
        {groupItem.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <GroupItem key={item.name} team={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ReorderableGroup;

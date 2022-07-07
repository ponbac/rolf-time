type TeamFlagProps = {
  team: Team;
  width?: string;
  className?: string;
};
const TeamFlag = (props: TeamFlagProps) => {
  const { team, width, className = undefined } = props;

  return (
    <img
      style={{ width: width }}
      draggable="false"
      className={className ? className : "rounded-sm"}
      alt={`${team.name} flag`}
      src={`https://flagicons.lipis.dev/flags/4x3/${team.flagCode}.svg`}
    />
  );
};

export default TeamFlag;

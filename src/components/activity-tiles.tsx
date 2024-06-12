import { Card, Flex } from "antd";
import colors from "../constants/colours";
import { toLetterCase } from "../utils/string-operation";

interface IActivityTiles {
  activities: string[];
  activitySelected: string;
  onClickFunction?: (activity: string) => void;
}

const ActivityTiles: React.FC<IActivityTiles> = ({
  activities,
  activitySelected,
  onClickFunction,
}) => {
  const style: React.CSSProperties = {
    marginRight: "12px",
    cursor: "pointer",
    padding: "8px 16px",
    border: '1px solid #F1F1F1',
    borderRadius: '8px',
    color:'#05070B',
    fontWeight:'400',
  };

  let selectedStyle: React.CSSProperties = {
    ...style,
    backgroundColor: "#05070B",
    color: "#000",
    fontWeight:'700',
    border: '0.5px solid #05070B',
    background: 'rgba(5, 7, 11, 0.05)'
  };

  const cardTile = (activity: string) => (
    <Flex
      style={activity == activitySelected ? selectedStyle : style}
      onClick={async () => {
        if (onClickFunction) onClickFunction(activity);
      }}
    >
      <span
        style={{
         whiteSpace:'nowrap'
        }}
      >
        {toLetterCase(activity)}
      </span>
    </Flex>
  );

  return (
    <div
      style={{
        width: "90vw",
        overflow: "auto",
        marginTop: "21px",
        marginBottom: "21px",
        scrollbarWidth: "none",
        scrollBehavior:'smooth'

      }}
    >
      <Flex
        style={{
          flex: 1,
          // justifyContent: "space-evenly",
          alignContent: "center",
          fontWeight: "bold",
        }}
      >
        <span key={"ALL"}>{cardTile("all")}</span>
        {activities.map((activity) => (
          <span key={activity}>{cardTile(activity.toLowerCase())}</span>
        ))}
      </Flex>
    </div>
  );
};

export default ActivityTiles;

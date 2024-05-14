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
    borderRadius: "12px",
    cursor: "pointer",

    padding: "10px",
    borderStyle: "solid",
    borderColor: colors.border,
  };

  let selectedStyle: React.CSSProperties = {
    ...style,
    backgroundColor: "#05070B",
    color: "white",
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
          paddingRight: "33%",
          alignItems: "center",
          justifyContent: "center",
          //   paddingBottom: "16%",
          //   paddingTop: "16%",
        }}
      >
        {toLetterCase(activity)}
      </span>
    </Flex>
  );

  return (
    <div
      style={{
        width: "100vw",
        overflow: "auto",
        marginTop: "21px",
        marginBottom: "21px",
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

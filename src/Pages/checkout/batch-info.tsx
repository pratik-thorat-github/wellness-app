import { Flex } from "antd";

import { ReactComponent as Yoga } from "../../images/class-images/yoga.svg";
import { IBatch, IGymDetails } from "../../types/gyms";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import colors from "../../constants/colours";

interface IBatchInfoOnCheckout {
  batchDetails: IBatch;
  gymData: IGymDetails;
  logoTsx?: JSX.Element;
}

const BatchInfoOnCheckout: React.FC<IBatchInfoOnCheckout> = ({
  batchDetails,
  gymData,
  logoTsx,
}) => {
  return (
    <Flex flex={1} vertical>
      <Flex
        flex={1}
        vertical
        justify="center"
        align="center"
        style={{ paddingTop: "24px", marginBottom: "12px" }}
      >
        <span>{logoTsx}</span>

        <span style={{ fontSize: "24px" }}>
          {batchDetails.activity} • {batchDetails.duration}min
        </span>
      </Flex>

      <Flex
        flex={1}
        vertical
        justify="center"
        align="center"
        style={{
          marginBottom: "12px",
          color: colors.secondary,
        }}
      >
        <span style={{ marginBottom: "4px" }}>
          {formatTimeIntToAmPm(batchDetails.startTime)},{" "}
          {formatDate(batchDetails.date)["date suffix - Day"]}
        </span>
        <span>
          At {gymData?.name}, {gymData?.area}
        </span>
      </Flex>
    </Flex>
  );
};

export default BatchInfoOnCheckout;

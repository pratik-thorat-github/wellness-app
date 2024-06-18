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
      <Flex flex={1} vertical justify="center" align="center" style={{}}>
        <span>{logoTsx}</span>

        <span style={{ fontSize: "24px", marginBottom: "20px" }}>
          {batchDetails?.activity} •{" "}
          {batchDetails?.isDayPass
            ? "All Day"
            : `${batchDetails?.DurationMin}min`}
        </span>

        <span style={{ marginBottom: "4px", color: colors.secondary }}>
          {batchDetails?.startTime &&
            formatTimeIntToAmPm(batchDetails?.startTime)}
          ,{" "}
          {batchDetails?.date &&
            formatDate(batchDetails?.date)["date suffix - Day"]}
        </span>
        <span style={{ color: colors.secondary }}>
          At {gymData?.name}, {gymData?.area}
        </span>
      </Flex>
    </Flex>
  );
};

export default BatchInfoOnCheckout;

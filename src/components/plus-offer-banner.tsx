import { Flex } from "antd";
import { ReactComponent as Percentage } from "../images/gym/percentage-symbol.svg";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../atoms/atom";
import colors from "../constants/colours";

const PlusOfferBanner: React.FC = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      style={{
        backgroundColor: "#EFDBE5",
        marginTop: "8px",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <span style={{ marginRight: "5px" }}>
        <Percentage />
      </span>{" "}
      {plusDetails?.plusDiscountPercent}% off on every class with{" "}
      <b style={{ color: colors.plus, marginLeft: "2px" }}> plus</b>
    </Flex>
  );
};

export default PlusOfferBanner;

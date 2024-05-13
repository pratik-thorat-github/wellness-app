import { Flex } from "antd";
import PlusOfferBanner from "../../components/plus-offer-banner";
import { Rs } from "../../constants/symbols";
import colors from "../../constants/colours";

interface IPlusMembershipPrice {
  plusMembershipPrice: number;
}

const PlusMembershipPrice: React.FC<IPlusMembershipPrice> = ({
  plusMembershipPrice,
}) => {
  return (
    <Flex
      flex={1}
      vertical
      style={{
        marginBottom: "16px",
      }}
    >
      <Flex flex={1}>
        <Flex flex={2} justify="left" align="center">
          <span>
            <span style={{ color: colors.plus, fontWeight: "bold" }}>
              plus{" "}
            </span>
            membership price{" "}
          </span>
        </Flex>

        <Flex flex={1} justify="right" align="center">
          <span style={{ fontWeight: "bold" }}>
            {Rs}
            {plusMembershipPrice}
          </span>
        </Flex>
      </Flex>

      <Flex flex={1} style={{}}>
        <PlusOfferBanner />
      </Flex>
    </Flex>
  );
};

export default PlusMembershipPrice;

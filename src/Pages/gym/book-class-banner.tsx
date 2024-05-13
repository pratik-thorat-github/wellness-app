import { Flex } from "antd";
import PlusOfferBanner from "../../components/plus-offer-banner";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";

const BookClassBanner: React.FC = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  return (
    <Flex
      flex={1}
      vertical
      justify="space-around"
      style={{
        paddingLeft: "24px",
        paddingRight: "24px",
        marginBottom: "16px",
      }}
    >
      <Flex flex={1} align="left" justify="left">
        <span style={{ fontWeight: "bold" }}>Book a class</span>
      </Flex>

      {!plusDetails?.isPlusMember ? (
        <Flex flex={1}>
          <PlusOfferBanner />
        </Flex>
      ) : null}
    </Flex>
  );
};

export default BookClassBanner;

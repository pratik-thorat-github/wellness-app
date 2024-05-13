import { Flex } from "antd";

const LandingFooter: React.FC = () => {
  return (
    <Flex
      flex={1}
      style={{
        backgroundColor: "#05070B",
        color: "white",
        padding: "24px",
        fontSize: "8px",
      }}
      justify="space-evenly"
    >
      <Flex vertical flex={1}>
        Contact Us
      </Flex>

      <Flex flex={1}>Privacy Policy</Flex>

      <Flex flex={1}>Terms And Conditions</Flex>
      <Flex flex={1}>Refund And Cancellation policy</Flex>
    </Flex>
  );
};

export default LandingFooter;

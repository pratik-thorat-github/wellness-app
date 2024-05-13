import { Flex } from "antd";

const LandingHeader: React.FC = () => {
  return (
    <Flex
      flex={1}
      style={{
        backgroundColor: "#05070B",
        color: "white",
        padding: "24px",
      }}
    >
      <Flex
        style={{ fontWeight: "bold", fontSize: "24px" }}
        flex={1}
        justify="flex-start"
      >
        ZenFitX
      </Flex>

      {/* <Flex flex={1} justify="flex-end">
        Login
      </Flex> */}
    </Flex>
  );
};

export default LandingHeader;

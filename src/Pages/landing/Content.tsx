import { Flex } from "antd";
import "./style.css";
import { navigate } from "@reach/router";

// import background from "../../images/landing/Slide 16_9 - 2landing-background.png";

const LandingContent: React.FC = () => {
  return (
    <Flex
      flex={1}
      vertical
      justify="center"
      align="center"
      style={{
        // backgroundImage: `url(${background})`,
        backgroundColor: "white",
        borderRadius: "14px",
        padding: "16px",
        marginLeft: "16px",
        marginRight: "16px",
      }}
    >
      <Flex flex={1} style={{ fontSize: "24px" }}>
        Z E N F I T{" "}
        <span style={{ fontWeight: "bolder", marginLeft: "4px" }}>X</span>
      </Flex>
      <Flex flex={1} style={{ marginTop: "12px", fontWeight: "lighter" }}>
        Discover, Book, and Save on Fitness
      </Flex>
      <Flex flex={1}>& Wellness Activities Near You!</Flex>
      <Flex
        onClick={() => {
          navigate("/");
        }}
        flex={1}
        className="try-now"
        justify="center"
      >
        TRY NOW
      </Flex>
    </Flex>
  );
};

export default LandingContent;

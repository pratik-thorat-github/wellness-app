import { PhoneOutlined } from "@ant-design/icons";
import { Flex } from "antd";

const NeedHelpBanner: React.FC = () => {
  const helpLine = "9002782111";

  return (
    <Flex vertical flex={1} style={{ padding: "16px" }}>
      <Flex flex={1} style={{ fontWeight: "bold" }}>
        Need help?
      </Flex>
      <Flex
        onClick={() => {
          window.open(`tel:+91${helpLine}`);
        }}
        flex={1}
        style={{
          fontWeight: "bold",
          background: "white",
          marginTop: "16px",
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderRadius: "12px",
        }}
      >
        <span style={{ marginRight: "12px" }}>
          <PhoneOutlined style={{ transform: "rotate(90deg)" }} />
        </span>
        <span>Call at {helpLine}</span>
      </Flex>
    </Flex>
  );
};

export default NeedHelpBanner;

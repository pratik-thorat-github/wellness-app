import { Flex } from "antd";
import { nikitaAddress, helpLine, nikitaEmail } from "../../constants/info";

// const tncPath = ;

const LandingFooter: React.FC = () => {
  return (
    <Flex
      flex={1}
      style={{
        backgroundColor: "#05070B",
        color: "white",
        padding: "24px",
        fontSize: "12px",
      }}
      justify="space-evenly"
    >
      <Flex vertical flex={1}>
        <Flex flex={1} style={{ fontSize: "12px", marginBottom: "2px" }}>
          <u>Contact Us</u>
        </Flex>
        <Flex flex={1}>Phone - +91-{helpLine}</Flex>
        <Flex flex={1}>Address - {nikitaAddress}</Flex>
        <Flex flex={1}>Email - {nikitaEmail}</Flex>
      </Flex>

      <Flex flex={1}>
        <u>
          <a
            style={{ color: "white" }}
            href={require("../../docs/Privacy-Policy.pdf")}
            download="ZenfitX-Privacy-Policy"
          >
            Privacy Policy
          </a>
        </u>
      </Flex>

      <Flex flex={1}>
        <u>
          <a
            style={{ color: "white" }}
            href={require("../../docs/TNC.pdf")}
            download="ZenfitX-TNC"
          >
            Terms And Conditions
          </a>
        </u>
      </Flex>
      <Flex flex={1}>
        <u>
          <a
            style={{ color: "white" }}
            href={require("../../docs/Refund-Cancellation-Policy.pdf")}
            download="ZenfitX-Refund&Cancellation"
          >
            Refund And Cancellation policy
          </a>
        </u>
      </Flex>
    </Flex>
  );
};

export default LandingFooter;

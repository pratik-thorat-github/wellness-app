import { Flex } from "antd";
import { nikitaAddress, helpLine, nikitaEmail } from "../../constants/info";
import { useRef } from "react";

// const tncPath = ;

const LandingFooter: React.FC = () => {
  const clickCount = useRef(0);

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
      <Flex vertical flex={1} justify="flex-start">
        <Flex
          onClick={() => {
            clickCount.current++;
            if (clickCount.current % 3 == 0) localStorage.clear();
          }}
          flex={1}
          style={{ fontSize: "12px", marginBottom: "2px" }}
        >
          <u>Contact Us</u>
        </Flex>
        <Flex flex={1}>Phone - +91-{helpLine}</Flex>
        <Flex flex={1}>Address - {nikitaAddress}</Flex>
        <Flex style={{}} flex={1}>
          Email - {nikitaEmail}
        </Flex>
      </Flex>

      <Flex flex={1} vertical align="flex-end">
        <Flex flex={1} justify="flex-end">
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

        <Flex flex={1} justify="flex-end">
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

        <Flex flex={1} justify="flex-end">
          <u>
            <a
              style={{ color: "white" }}
              href={require("../../docs/Refund-Cancellation-Policy.pdf")}
              download="ZenfitX-Refund&Cancellation"
            >
              Refund & Cancellation
            </a>
          </u>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LandingFooter;

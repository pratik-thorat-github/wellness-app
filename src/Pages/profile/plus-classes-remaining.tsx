import { Flex } from "antd";
import colors from "../../constants/colours";
import { useAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";

const PlusClassRemaining: React.FC = () => {
  const [plusDetails] = useAtom(plusDetailsAtom);

  return (
    <Flex flex={1} style={{ background: "white" }}>
      <Flex
        flex={1}
        style={{
          padding: "16px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <Flex
          flex={5}
          justify="flex-start"
          align="center"
          style={{
            borderLeftWidth: "4px",
            borderLeftStyle: "solid",
            paddingLeft: "12px",
            borderRadius: "5px",
            color: colors.secondary,
          }}
        >
          <span>
            <span style={{ fontWeight: "bolder", color: "black" }}>
              {Math.min(plusDetails?.plusClassesRemaining as number, 5)}/5
            </span>{" "}
            classes with {plusDetails?.plusDiscountPercent}% off are left on
            <span
              style={{
                color: colors.plus,
                fontWeight: "bolder",
                marginLeft: "2px",
              }}
            >
              plus
            </span>
            , book classes to redeem!
          </span>
        </Flex>

        <Flex
          vertical
          flex={1}
          style={{ marginLeft: "5px" }}
          align="center"
          justify="center"
        >
          <span
            style={{
              background: "#EFDBE5",
              padding: "8px",
              borderRadius: "4px",
              fontWeight: "bolder",
              color: colors.plus,
            }}
          >
            {Math.min(plusDetails?.plusClassesRemaining as number, 5)}
          </span>
          <span
            style={{
              background: colors.plus,
              paddingLeft: "5px",
              paddingRight: "5px",
              borderRadius: "4px",
              color: "white",
            }}
          >
            left
          </span>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PlusClassRemaining;

import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import colors from "../../constants/colours";

const UserDetails: React.FC = () => {
  const [userDetails] = useAtom(userDetailsAtom);

  return (
    <Flex
      flex={1}
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "16px",
        // marginTop: "8px",
      }}
    >
      <span
        // flex={1}
        // align="center"
        // justify="flex-start"
        style={{ marginRight: "12px" }}
      >
        <UserOutlined />
      </span>

      <Flex flex={1} vertical style={{}}>
        <span style={{ fontSize: "16px" }}>{userDetails?.name}</span>
        <span
          style={{
            fontSize: "12px",
            color: colors.secondary,
            marginTop: "4px",
          }}
        >
          {userDetails?.phone}
        </span>
      </Flex>
    </Flex>
  );
};

export default UserDetails;

import { UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";

const ProfileBanner: React.FC = () => {
  const [userDetails] = useAtom(userDetailsAtom);

  let firstName = userDetails?.name.split(" ")[0];

  return (
    <Flex
      flex={1}
      style={{
        padding: "10px",
        fontSize: 24,
      }}
    >
      <Flex flex={1} justify="left" align="center">
        {userDetails ? `Hi {firstName}` : "Hello there"}
      </Flex>
      {userDetails ? (
        <Flex
          onClick={() => {
            navigate("/profile");
          }}
          flex={1}
          justify="right"
          align="center"
        >
          <UserOutlined />
        </Flex>
      ) : null}
    </Flex>
  );
};

export default ProfileBanner;

import { UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useAtom } from "jotai/react";
import { userDetailsAtom } from "../../atoms/atom";
import { navigate } from "@reach/router";
import { Mixpanel } from "../../mixpanel/init";

const ProfileBanner: React.FC = () => {
  const [userDetails] = useAtom(userDetailsAtom);

  return (
    <Flex
      flex={1}
      style={{
        paddingLeft: "10px",
        paddingRight: "10px",
        marginBottom: "10px",
        fontSize: 24,
      }}
    >
      <Flex
        flex={1}
        justify="left"
        align="center"
        style={{ fontFamily: "plus-jakarta-sans" }}
      >
        Hi {userDetails?.name}!
      </Flex>
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
    </Flex>
  );
};

export default ProfileBanner;

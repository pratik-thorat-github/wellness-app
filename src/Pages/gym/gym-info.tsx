import { Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import { IGymDetails } from "../../types/gyms";
import { concatAndUpperCaseActivities } from "../../utils/activities";
import colors from "../../constants/colours";

import { ReactComponent as LocationLogo } from "../../images/home/location.svg";
import { checkIpad, checkIphone } from "../../utils/navigator";

import parser from "html-react-parser";

const maxChar = 75;

interface IGymInfo {
  gymData: IGymDetails;
}

const GymInfo: React.FC<IGymInfo> = ({ gymData }) => {
  const description = `${gymData.addressLine1},${gymData.addressLine2}<br>${gymData.description}`;

  let [isTruncated, setIsTruncated] = useState(description.length > maxChar);
  let shortDescription = useRef(description.substring(0, maxChar));
  shortDescription.current.replace(/<br>/, "");

  // const mapsLink = checkIphone() || checkIpad() ? "maps://0,0?q" : "geo:0,0?q";
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${gymData.addressLine1},${gymData.addressLine2}`;

  const seeMore = (
    <span>
      ...<u>See more</u>{" "}
    </span>
  );

  const seeLess = (
    <span>
      ...<u>See less</u>{" "}
    </span>
  );

  return (
    <Flex
      flex={1}
      vertical
      style={{
        padding: "24px",
      }}
    >
      <Flex flex={1}>
        <Flex flex={1} vertical justify="flex-start" align="left">
          <span
            style={{
              fontSize: "16",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {gymData.name}
          </span>
          <span style={{ color: colors.secondary, fontSize: "14px" }}>
            {concatAndUpperCaseActivities(gymData.activities)}
          </span>
        </Flex>
        <Flex
          onClick={() => {
            window.open(mapsLink);
          }}
          style={{
            color: colors.secondary,
            fontSize: "14px",
            marginBottom: "8px",
          }}
          flex={1}
          justify="flex-end"
          align="right"
        >
          <u>
            <LocationLogo /> {gymData.area}
          </u>
        </Flex>
      </Flex>
      {/* <Flex
        flex={1}
        style={{ marginTop: "4px", fontSize: "14px", color: colors.secondary }}
      >
        <Flex flex={1} justify="flex-start">
          Address :
        </Flex>
        <Flex flex={4} justify="stretch">
          {gymData.addressLine1},{gymData.addressLine2}
        </Flex>
      </Flex> */}
      <Flex
        flex={1}
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: colors.secondary,
          paddingBottom: "16px",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: colors.border,
        }}
        onClick={() => {
          setIsTruncated(!isTruncated);
        }}
      >
        {isTruncated ? (
          <div>
            {shortDescription.current}
            <span>{seeMore}</span>
          </div>
        ) : description.length > maxChar ? (
          <div>
            {parser(description)}
            <span>{seeLess}</span>
          </div>
        ) : (
          <div>{parser(description)}</div>
        )}
      </Flex>
    </Flex>
  );
};

export default GymInfo;

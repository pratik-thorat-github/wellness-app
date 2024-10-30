import { Flex } from "antd";
import activityToSvgMap from "../../images/class-images/activity-map";
import colors from "../../constants/colours";

import { ReactComponent as LocationSVG } from "../../images/home/location.svg";
import { Rs } from "../../constants/symbols";
import { IBookings } from "../../types/user";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import { createMapsLink, toLetterCase } from "../../utils/string-operation";

interface BookingClassCard {
  booking: IBookings;
}

const ClassCardInProfile: React.FC<BookingClassCard> = ({ booking }) => {
  let addressLine1: string, addressLine2: string;
  if (booking.venueAddressLine1 && booking.venueAddressLine2) {
    addressLine1 = booking.venueAddressLine1;
    addressLine2 = booking.venueAddressLine2;
  } else {
    addressLine1 = booking.addressLine1;
    addressLine2 = booking.addressLine2;
  }
  const mapsLink = createMapsLink(addressLine1, addressLine2);

  return (
    <Flex
      flex={1}
      style={{
        alignSelf: "stretch",
        backgroundColor: "white",
        borderRadius: "12px",
        minWidth: "90vw",
        marginBottom: "10px",
      }}
    >
      <Flex
        vertical
        flex={1}
        style={{
          padding: "16px",
        }}
      >
        <Flex
          flex={1}
          justify="center"
          align="center"
          style={{
            borderBottom: "2px dashed",
            borderBottomColor: colors.border,
            paddingBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Flex align="flex-start">{activityToSvgMap(booking.activity)}</Flex>
          <Flex vertical align="flex-start" style={{ marginLeft: "8px" }}>
            <Flex
              flex={1}
              style={{ color: colors.secondary, fontSize: "14px" }}
            >
              {" "}
              {toLetterCase(booking.activityName)} . {booking.durationMin}min{" "}
            </Flex>

            <Flex flex={1} style={{ fontSize: "16px", marginTop: "4px" }}>
              {" "}
              {formatTimeIntToAmPm(booking.startTime)},{" "}
              {formatDate(booking.date)["date suffix"]}
            </Flex>

            <Flex
              flex={1}
              style={{
                color: colors.secondary,
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              <Flex
                flex={1}
                justify="flex-start"
                style={{ justifyContent: "flex-start" }}
              >
                {Rs}
                {booking.bookingPrice}
              </Flex>
              <Flex flex={1} justify="flex-end">
                Booking Id: {booking.bookingId.replace(/book_/g, "")}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex flex={1} style={{ paddingTop: "16px", fontSize: "12px" }}>
          <Flex flex={1} justify="flex-start">
            <span style={{ marginRight: "8px" }}>
              {" "}
              <LocationSVG />{" "}
            </span>
            <span> {booking.name} </span>
          </Flex>

          <Flex
            justify="flex-end"
            style={{
              fontWeight: "bold",
              marginLeft: "8px",
            }}
            onClick={() => {
              window.open(mapsLink);
            }}
          >
            <u> Get Direction </u>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClassCardInProfile;

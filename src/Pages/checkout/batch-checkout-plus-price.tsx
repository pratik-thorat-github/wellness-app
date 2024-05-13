import { Flex } from "antd";

import { ReactComponent as EmptyCircle } from "../../images/checkout/empty-circle.svg";
import { ReactComponent as CheckedCircle } from "../../images/checkout/checked-circle.svg";
import { Rs } from "../../constants/symbols";
import PlusMembershipPrice from "./plus-membership-price";
import { IBatch } from "../../types/gyms";
import { useEffect, useState } from "react";
import { ESelectedPlan } from "../../types/checkout";
import { useAtom, useSetAtom } from "jotai/react";
import { plusDetailsAtom } from "../../atoms/atom";
import { IPlusDetails } from "../../types/user";
import colors from "../../constants/colours";

interface IBatchCheckoutPlusPrice {
  batchDetails: IBatch;
  setTotalAmount: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedPlanState: [
    ESelectedPlan,
    React.Dispatch<React.SetStateAction<ESelectedPlan>>
  ];
  plusDetails: IPlusDetails | null;
}

const BatchCheckoutPlusPrice: React.FC<IBatchCheckoutPlusPrice> = ({
  batchDetails,
  setTotalAmount,
  selectedPlanState,
  plusDetails,
}) => {
  const discountPercentage = plusDetails?.plusDiscountPercent as number;
  const plusMembershipPrice = plusDetails?.plusMemberShipPrice as number;
  const discountedPrice = (1 - discountPercentage / 100) * batchDetails.price;
  const saving = batchDetails.price - discountedPrice;

  const [selectedPlan, setSelectedPlan] = selectedPlanState;

  return (
    <Flex
      flex={1}
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        cursor: "pointer",
      }}
      vertical
      onClick={() => {
        setTotalAmount(discountedPrice + plusMembershipPrice);

        // If it was not selected, and clicked, the selectedPlan needs to change
        setSelectedPlan(ESelectedPlan.BATCH_WITH_PLUS);
      }}
    >
      <Flex
        flex={1}
        style={{
          marginBottom: "16px",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: colors.border,
        }}
      >
        <Flex flex={2} justify="left" align="center">
          <Flex flex={1}>
            {selectedPlan === ESelectedPlan.BATCH_WITH_PLUS ? (
              <CheckedCircle />
            ) : (
              <EmptyCircle />
            )}
          </Flex>
          <Flex flex={3} align="center" vertical>
            <span>
              Class Price with
              <span style={{ color: colors.plus, fontWeight: "bold" }}>
                {" "}
                plus{" "}
              </span>
            </span>
            <span style={{ color: "#3EAA63", marginTop: "4px" }}>
              {discountPercentage}% off, saving {Rs}
              {saving}
            </span>
          </Flex>
        </Flex>
        <Flex flex={1} align="center">
          <Flex flex={1} vertical align="flex-end">
            <span style={{ fontWeight: "bold" }}>
              {Rs}
              {discountedPrice}
            </span>
            <span
              style={{
                textDecoration: "line-through",
                color: colors.secondary,
                marginTop: "4px",
              }}
            >
              {Rs}
              {batchDetails.price}
            </span>
          </Flex>
        </Flex>
      </Flex>

      <Flex flex={1}>
        <PlusMembershipPrice plusMembershipPrice={plusMembershipPrice} />
      </Flex>
    </Flex>
  );
};

export default BatchCheckoutPlusPrice;

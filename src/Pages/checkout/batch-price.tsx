import { Flex } from "antd";
import { Rs } from "../../constants/symbols";
import { ReactComponent as CheckedCircle } from "../../images/checkout/checked-circle.svg";
import { ReactComponent as EmptyCircle } from "../../images/checkout/empty-circle.svg";
import { IBatch } from "../../types/gyms";
import { useEffect, useState } from "react";
import { ESelectedPlan } from "../../types/checkout";

interface IBatchPrice {
  batchDetails: IBatch;
  setTotalAmount: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedPlanState: [
    ESelectedPlan,
    React.Dispatch<React.SetStateAction<ESelectedPlan>>
  ];
}

const BatchPrice: React.FC<IBatchPrice> = ({
  batchDetails,
  setTotalAmount,
  selectedPlanState,
}) => {
  const [selectedPlan, setSelectedPlan] = selectedPlanState;

  return (
    <Flex
      flex={1}
      style={{
        padding: "16px",
        cursor: "pointer",
      }}
      onClick={() => {
        setTotalAmount(batchDetails.price);

        // If it was not selected, and clicked, the selectedPlan needs to change
        setSelectedPlan(ESelectedPlan.BATCH);
      }}
    >
      <Flex flex={2} justify="left" align="center">
        <Flex flex={1}>
          {selectedPlan === ESelectedPlan.BATCH ? (
            <CheckedCircle />
          ) : (
            <EmptyCircle />
          )}
        </Flex>
        <Flex flex={3} justify="flex-start" align="flex-start">
          Class Price
        </Flex>
      </Flex>
      <Flex flex={1} justify="right" align="center">
        <span style={{ fontWeight: "bold" }}>
          {Rs}
          {batchDetails.price}
        </span>
      </Flex>
    </Flex>
  );
};

export default BatchPrice;

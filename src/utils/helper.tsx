import { ReactComponent as Training1o1 } from "../images/ameneties/training1o1.svg";
import { ReactComponent as AC } from "../images/ameneties/AC.svg";
import { ReactComponent as Cafe } from "../images/ameneties/Cafe.svg";
import { ReactComponent as CardioMachines } from "../images/ameneties/CardioMachines.svg";
import { ReactComponent as Changingroom } from "../images/ameneties/ChangingRoom.svg";
import { ReactComponent as ChildCareService } from "../images/ameneties/ChildCareService.svg";
import { ReactComponent as Deadlift } from "../images/ameneties/Deadlift.svg";
import { ReactComponent as DrinkingWater } from "../images/ameneties/DrinkingWater.svg";
import { ReactComponent as FIrstAid } from "../images/ameneties/FirstAid.svg";
import { ReactComponent as FreeWeights } from "../images/ameneties/FreeWeights.svg";
import { ReactComponent as FreeWifi } from "../images/ameneties/Free Wifi.svg";
import { ReactComponent as GroupClasses } from "../images/ameneties/GroupClasses.svg";
import { ReactComponent as InbodyScans } from "../images/ameneties/InbodyScans.svg";
import { ReactComponent as Locker } from "../images/ameneties/Locker.svg";
import { ReactComponent as Lounge } from "../images/ameneties/Lounge.svg";
import { ReactComponent as MassageInHouse } from "../images/ameneties/MassageInHouse.svg";
import { ReactComponent as NutritionistInHouse } from "../images/ameneties/NutritionistInHouse.svg";
import { ReactComponent as OpenFloorSpace } from "../images/ameneties/OpenFloorSpace.svg";
import { ReactComponent as Parking } from "../images/ameneties/Parking.svg";
import { ReactComponent as PhysioInHouse } from "../images/ameneties/PhysioInHouse.svg";
import { ReactComponent as Sauna } from "../images/ameneties/Sauna.svg";
import { ReactComponent as Shower } from "../images/ameneties/Shower.svg";
import { ReactComponent as SquatRack } from "../images/ameneties/SquatRack.svg";
import { ReactComponent as Pool } from "../images/ameneties/Pool.svg";





        
export const applicationIcons = (iconType: string) => {
  switch (iconType) {
    case "TRAINING_1_ON_1":
      return <Training1o1 />;
    case "GROUP_CLASSES":
      return <GroupClasses />;
    case "SQUATRACK":
      return <SquatRack />;
    case "DEADLIFT":
      return <Deadlift />;
    case "CARDIO_MACHINES":
      return <CardioMachines />;
    case "FREE_WEIGHTS":
      return <FreeWeights />;
    case "OPEN_FLOOR_SPACE":
      return <OpenFloorSpace />;
    case "SHOWER":
      return <Shower />;
    case "AC":
      return <AC />;
    case "DRINKING_WATER":
      return <DrinkingWater />;
    case "CHANGING_ROOM":
      return <Changingroom />;
    case "FIRST_AID":
      return <FIrstAid />;
    case "LOUNGE":
      return <Lounge />;
    case "LOCKER":
      return <Locker />;
    case "FREE_WIFI":
      return <FreeWifi />;
    case "PARKING":
      return <Parking />;
    case "CAFE":
      return <Cafe />;
    case "SAUNA":
      return <Sauna />;
    case "PHYSIO_IN_HOUSE":
      return <PhysioInHouse />;
    case "NUTRITIONIST_IN_HOUSE":
      return <NutritionistInHouse />;
    case "MASSAGE_IN_HOUSE":
      return <MassageInHouse />;
    case "CHILD_CARE_SERVICE":
      return <ChildCareService />;
    case "INBODY_SCANS":
      return <InbodyScans />;
    case "POOL":
      return <Pool />;
    default:
      return <Training1o1 />;
  }
};


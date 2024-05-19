import { ReactComponent as Yoga } from "./yoga.svg";
import { ReactComponent as Pilate } from "./pilate.svg";
import { ReactComponent as Swimming } from "./swimming.svg";
import { ReactComponent as Badminton } from "./badminton.svg";
import { ReactComponent as Hiit } from "./hiit.svg";
import { ReactComponent as Pt } from "./pt.svg";
import { ReactComponent as Strength } from "./strength.svg";
import { ReactComponent as Boxing } from "./boxing.svg";
import { ReactComponent as Zumba } from "./zumba.svg";
import { ReactComponent as Gym } from "./gym.svg";

const activityToSvgMap = (activity: string): JSX.Element => {
  activity = activity.toLowerCase();

  const yoga = (
    <span>
      <Yoga />
    </span>
  );
  const pilate = (
    <span>
      <Pilate />
    </span>
  );
  const swimming = (
    <span>
      <Swimming />
    </span>
  );
  const badminton = (
    <span>
      <Badminton />
    </span>
  );
  const strength = (
    <span>
      <Strength />
    </span>
  );
  const hiit = (
    <span>
      <Hiit />
    </span>
  );
  const pt = (
    <span>
      <Pt />
    </span>
  );
  const boxing = (
    <span>
      <Boxing />
    </span>
  );
  const zumba = (
    <span>
      <Zumba />
    </span>
  );
  const gym = (
    <span>
      <Gym />
    </span>
  );

  const empty = <span></span>;

  let map: object = {
    yoga: yoga,
    pilate: pilate,
    badminton: badminton,
    strength: strength,
    hiit: hiit,
    swimming: swimming,
    pt: pt,
    boxing: boxing,
    zumba: zumba,
    "kick boxing": boxing,
    gym: gym,
  };

  if (map[activity as keyof object]) return map[activity as keyof object];
  else return empty;
};

export default activityToSvgMap;

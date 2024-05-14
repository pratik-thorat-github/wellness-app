import { Flex } from "antd";
import "./style.css";

const LandingContent: React.FC = () => {
  return (
    <Flex
      flex={1}
      vertical
      justify="center"
      style={{
        backgroundImage: `url("../../images/landing/ZenfitX-Background.jpeg")`,
      }}
    >
      <Flex flex={1} justify="center" align="center">
        <ul>
          <li>
            Unleash Your Inner Athlete: Explore Fitness, One Day at a Time with{" "}
          </li>
          <li>
            No Contracts, All Fun: Try Different Fitness Classes with ZenFitX
            Day Passes
          </li>
          <li>
            Find Your Perfect Fit: Explore Endless Fitness Activities with
            ZenFitX
          </li>
          ZenFitX
        </ul>
      </Flex>

      <Flex flex={1} justify="center" align="flex-start">
        <ul>
          <li>
            <span className="heading-point">Tired of the gym grind? </span>{" "}
            ZenFitX offers a refreshing alternative. Discover a world of fitness
            activities near you, from high-energy Zumba to peaceful yoga, all
            with our convenient 1-day pass system. No commitment, just pure
            exploration!
          </li>
          <li>
            <span className="heading-point">Find your perfect fit.</span> Trying
            a new class can be intimidating. With ZenFitX, you can dip your toes
            into anything that piques your interest, without the pressure of a
            long-term commitment.
          </li>
          <li>
            <span className="heading-point">
              Variety is the spice of life (and fitness!)
            </span>{" "}
            Don't get stuck in a rut. ZenFitX allows you to explore different
            fitness styles, find new favorites, and keep your workouts exciting.
          </li>
          <li>
            <span className="heading-point">Flexible and Fun</span>: Our day
            passes give you the freedom to fit fitness into your busy schedule.
            Try a spin class in the morning, or a kickboxing session after work
            - the possibilities are endless!
          </li>
        </ul>
      </Flex>
    </Flex>
  );
};

export default LandingContent;

import mixpanel, { Dict } from "mixpanel-browser";
mixpanel.init("241176b2340e1f8f3ada8f6945749d3e", {
  persistence: "localStorage",
});

// let env_check = process.env.NODE_ENV === "production";

let actions = {
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  track: (eventName: string, props?: Dict) => {
    mixpanel.track(eventName, props, {
      send_immediately: true,
    });
  },
  people: {
    set: (props: Dict) => {
      console.log(props);
      mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;

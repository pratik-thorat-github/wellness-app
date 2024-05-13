import mixpanel, { Dict } from "mixpanel-browser";
mixpanel.init("241176b2340e1f8f3ada8f6945749d3e", {
  debug: true,
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
    console.log("Before track - ", eventName, props);

    mixpanel.track(
      eventName,
      props,
      {
        send_immediately: true,
      },
      (res) => {
        console.log("After track - ", res);
      }
    );
  },
  people: {
    set: (props: Dict) => {
      console.log(props);
      mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;

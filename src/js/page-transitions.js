import { createShader } from "shaders/js";

const canvas = document.querySelector("#contact-gradient");

if (canvas) {
  await createShader(canvas, {
    components: [
      {
        type: "FlowingGradient",
        props: {
          colorA: "#F7F5FF", // airy lavender white
          colorB: "#DDD7F5", // soft lavender
          colorC: "#C9DDF2", // powder blue
          colorD: "#FFF8F5", // warm blush white

          colorSpace: "oklch",
          speed: 1.2,
          distortion: 0.9,
          seed: 5,
        },
      },
      { type: "CursorRipples", props: { intensity: 8, radius: 0.5 } },
    ],
  });
}

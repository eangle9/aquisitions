import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode: 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;

// const rules = [
//   slidingWindow({
//     mode: "LIVE",
//     interval: "2s",
//     max: 5,
//   }),
// ];

// if (process.env.NODE_ENV === "production") {
//   rules.push(
//     shield({ mode: "LIVE" }),
//     detectBot({
//       mode: "LIVE",
//       allow: [
//         "CATEGORY:SEARCH_ENGINE",
//         "CATEGORY:PREVIEW",
//       ],
//     })
//   );
// }

// const aj = arcjet({ key: process.env.ARCJET_KEY, rules: [] });

// export default aj;

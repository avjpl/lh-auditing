import _ from 'lodash';

const sample = {
  'https://www.whatcar.com': [
    {
      performance: 0.16,
      bestPractices: 0.73,
      accessibility: 0.79,
      seo: 0.84,
      progressiveWebApp: 0.67,
      timeToInteractive: {
        measurement: 15004,
        overBudget: 2904,
      },
      firstContentfulPaint: {
        measurement: 3876,
        overBudget: 2686,
      },
      totalBlockingTime: {
        measurement: 1581,
        overBudget: 221,
      },
      // "cumulativeLayoutShift": {
      // 	"measurement": {
      // 		"type": "numeric",
      // 		"value": 0.01867316351996528,
      // 		"granularity": 0.01
      // 	},
      // 	"overBudget": {
      // 		"type": "numeric",
      // 		"value": null,
      // 		"granularity": 0.01
      // 	}
      // }
    },
    {
      performance: 0.15,
      bestPractices: 0.73,
      accessibility: 0.79,
      seo: 0.84,
      progressiveWebApp: 0.67,
      timeToInteractive: {
        measurement: 16022,
        overBudget: 3922,
      },
      firstContentfulPaint: {
        measurement: 4067,
        overBudget: 2877,
      },
      totalBlockingTime: {
        measurement: 1708,
        overBudget: 348,
      },
      // "cumulativeLayoutShift": {
      // 	"measurement": {
      // 		"type": "numeric",
      // 		"value": 0.01867316351996528,
      // 		"granularity": 0.01
      // 	},
      // 	"overBudget": {
      // 		"type": "numeric",
      // 		"value": null,
      // 		"granularity": 0.01
      // 	}
      // }
    },
  ],
  'https://www.whatcar.com/skoda/superb/hatchback/review/n93': [
    {
      performance: 0.34,
      bestPractices: 0.8,
      accessibility: 0.86,
      seo: 0.84,
      progressiveWebApp: 0.67,
    },
    {
      performance: 0.4,
      bestPractices: 0.8,
      accessibility: 0.86,
      seo: 0.84,
      progressiveWebApp: 0.67,
    },
  ],
};

const getResult = (o) => (!o?.overBudget ? o : o.overBudget);
const metrics = [
  'performance',
  'bestPractices',
  'accessibility',
  'seo',
  'progressiveWebApp',
];
const webVital = [
  'progressiveWebApp',
  'timeToInteractive',
  'firstContentfulPaint',
  'totalBlockingTime',
];

const average = (entires) =>
  Object.entries(entires).reduce((acc, cur) => {
    acc[cur[0]] = {};

    cur[1].forEach((entry) => {
      return Object.keys(entry).forEach((key) => {
        if (!acc[cur[0]][key]) {
          acc[cur[0]][key] = { runs: [] };
        }

        metrics.includes(key)
          ? acc[cur[0]][key].runs.push(getResult(entry[key]) * 100)
          : webVital.includes(key)
          ? acc[cur[0]][key].runs.push(getResult(entry[key]) / 1000)
          : acc[cur[0]][key].runs.push(getResult(entry[key]));
      });
    });

    Object.entries(acc[cur[0]]).forEach((entry) => {
      const total = entry[1].runs.reduce((acc, val) => {
        return acc + val;
      }, 0);

      webVital.includes(entry[0])
        ? (acc[cur[0]][entry[0]].average = Number.parseFloat(
            (total / entry[1].runs.length).toFixed(2),
          ))
        : (acc[cur[0]][entry[0]].average = total / entry[1].runs.length);
    });

    return { ...acc };
  }, {});

export default average;

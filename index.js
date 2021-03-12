import Conflab from 'conflab';

import average from './average.js';
import gatherAudit from './gatherAudit.js';

const conflab = new Conflab();

const prettyFormat = (o) => JSON.stringify(o, null, '\t');

conflab.load(async (err, config) => {
  if (err) {
    console.error(err);
  }

  const averageAudits = async ({ budgets, port, runs }) => {
    const audits = {};
    const budgetsLen = budgets.length;

    for (let i = 0; i < budgetsLen; i++) {
      for (let j = 0; j < runs; j++) {
        if (!audits[budgets[i].url]) {
          audits[budgets[i].url] = [];
        }

        audits[budgets[i].url].push(await gatherAudit({ ...budgets[i], port }));
      }
    }

    return average(audits);
  };

  console.log(prettyFormat(await averageAudits(config)));
});

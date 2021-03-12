// import fs from 'fs';
import lh from 'lighthouse';
import cck from 'camelcase-keys';
import puppeteer from 'puppeteer';

const reduceResults = (results) => {
  return results.reduce((acc, cur) => {
    return {
      ...acc,
      ...cck({
        [cur.label]: {
          measurement: cur.measurement,
          overBudget: cur.overBudget,
        },
      }),
    };
  }, {});
};

const gatherAudit = async ({ url, budget: budgets, port }) => {
  const options = {
    extends: 'lighthouse:default',
    settings: { budgets },
  };

  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${port}`],
    headless: true,
  });
  const flags = { output: 'json', budgets, port };
  const runnerResult = await lh(url, flags, options);
  const report = JSON.parse(runnerResult.report);

  // fs.writeFileSync('report.json', prettyFormat(report));
  const perfBudget = report.audits['performance-budget'];
  const timingBudget = report.audits['timing-budget'];

  const isOverBudget = (item) => item.overBudget;
  const timingBudgetOver = timingBudget.details.items.filter(isOverBudget);
  const perfBudgetOver = perfBudget.details.items.filter(isOverBudget);

  const getScore = ({ title, score }) => cck({ [title]: score });

  const { performance, accessibility, bestPractices, seo, pwa } = cck(
    report.categories,
  );

  const metricReport = {
    ...getScore(performance),
    ...getScore(bestPractices),
    ...getScore(accessibility),
    ...getScore(seo),
    ...getScore(pwa),
    ...reduceResults(timingBudgetOver),
    ...reduceResults(perfBudgetOver),
  };

  await browser.close();

  return metricReport;
};

export default gatherAudit;

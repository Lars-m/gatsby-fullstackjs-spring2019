function getDateFromDkDate(date) {
  const dp = date.split("-");
  return new Date(dp[2], dp[1] - 1, dp[0]);
}

function periodLinks(edges, slug) {
  const days = edges
    .filter(e => {
      //console.log(e.node.fields.slug,periodTitle);
      const parts = e.node.fields.slug.split("/");
      //Refactor to check for period-title
      const isNotIndexForPeriod = parts.length > 3;
      const matchesSlug = e.node.fields.slug.indexOf(slug) >= 0;
      return matchesSlug && isNotIndexForPeriod;
    })
    .map(e => {
      //debugger
      e.dateFromStr = getDateFromDkDate(e.node.frontmatter.date);
      //console.log("DATE",e.dateFromStr)
      return e;
    });
  const sorted = days.sort(
    (a, b) => a.dateFromStr.getTime() - b.dateFromStr.getTime()
  );
  return sorted;
}

function linksFacade() {
  let asMap = null;
  let currentPeriod = "";
  return {
    setCurrentPeriod: current => (currentPeriod = current),
    getLinksForCurrentPeriod: () => {
      console.log("CURRENT ",currentPeriod)
      if (asMap[currentPeriod]) {
        return asMap[currentPeriod];
      }
      return [];
    },
    getLinksForAllPeriods: edges => {
      if (asMap !== null) {
        //console.log("CACHED")
        return asMap;
      }
      const periods = edges
        //Only go for period titles, find period from slug sort and convert to a map (object)
        .filter(e => e.node.frontmatter.periodTitle)
        .map(e => {
          const period = e.node.fields.slug.split("/")[1];
          return { period };
        });
      const sortedMap = periods.sort((a, b) =>
        a.period.toLowerCase() >= b.period.toLowerCase() ? 1 : -1
      );
      asMap = sortedMap.reduce((accumulator, current) => {
        const period = current.period;
        if (accumulator[period]) {
          throw Error("Duplicate Period Titles found: " + period);
        }
        accumulator[period] = [];
        return accumulator;
      }, {});

      for (let p in asMap) {
        asMap[p] = periodLinks(edges, p);
      }
      return asMap;
    }
  };
}
const linkFacade = linksFacade();
export default {
  linkFacade: linkFacade,
  periodLinks: periodLinks
};

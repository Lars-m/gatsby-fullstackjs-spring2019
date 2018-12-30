import React from "react"
import { css } from "react-emotion"
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"

//TODO --> REFACTOR into helpers
function getDayInWeekFromDkDate(date) {
  const dp = date.split("-");
  const dayInWeek = new Date(dp[2], dp[1] - 1, dp[0]).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thuersday",
    "Friday",
    "Saturday"
  ];
  return days[dayInWeek];
}
function getDateFromDkDate(date) {
  const dp = date.split("-");
  return new Date(dp[2], dp[1] - 1, dp[0]);
}

export default ({ data }) => {
  let days = data.allMarkdownRemark.edges.filter(({ node }) => node.fields.belongsToPeriod);
  days = days.map(d=>{
    const node = d.node;    
    const dateForTitle = `${node.frontmatter.date} (${getDayInWeekFromDkDate(node.frontmatter.date)})`
    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      date: getDateFromDkDate(node.frontmatter.date),
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      period: node.fields.belongsToPeriod
    }
  })
  days = days.sort((a, b) => a.date.getTime() - b.date.getTime() );
  console.log("DAYS",days)
  let period = "";
  return (
    <Layout>
      <div>
        <h1
          className={css`
            display: inline-block;
            border-bottom: 1px solid;
          `}
        >
          Full Semester Schedule
        </h1>
        <h4>{days.length} Posts</h4>
        {days.map(( day ) => {
          let newPeriod = null;
          if(period !== day.period){
            period = day.period;
            newPeriod = period;
          }
          return(
          <div key={day.id}>
            {newPeriod && <h2>{day.period}</h2>}
            <Link
              to={day.slug}
              className={css`
                text-decoration: none;
                color: inherit;
              `}
            >
              <h3 className={css`
                  margin-bottom: ${rhythm(1 / 4)};
                `}>
                {day.title}
                
              </h3>
              <p>{day.info}</p>
            </Link>
          </div>
        )})}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            pageintro
          }
          fields {
            slug
            belongsToPeriod
          }
          excerpt
        }
      }
    }
  }
`
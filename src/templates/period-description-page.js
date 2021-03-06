import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
//import { node } from "prop-types";
import all from "../helpers/periodLinks";
import goals from "../../images/goals.png";

const periodLinks = all.periodLinks;

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

export default ({ data }) => {
  const post = data.markdownRemark;
  const slug = data.markdownRemark.fields.slug;
  let links = [];
  let periodInfoHtml = null;
  let periodTitle = null;
  const sorted = periodLinks(data.allMarkdownRemark.edges, slug);
  //CHECK THIS
  periodInfoHtml = post.html;
  periodTitle = post.frontmatter.periodTitle;
  links = sorted.map((day, index) => {
    const dayInWeek = getDayInWeekFromDkDate(day.node.frontmatter.date);
    return (
      <tr key={index}>
        <td style={{ width: 100 }}>
          <Link
            style={{ fontSize: "larger", textDecoration: "none" }}
            to={day.node.fields.slug}
          >
            <span id={day.node.fields.slug.split("/")[1]}>{dayInWeek}</span>
          </Link>
          <br />
          {day.node.frontmatter.date}
        </td>
        <td>{day.node.frontmatter.pageintro}</td>
      </tr>
    );
  });

  return (
    <Layout>
      <div>
        <div
          style={{
            backgroundColor: "#295683",
            borderRadius: 5,
            color: "white",
            padding: 16,
            paddingTop: 1,
            paddingBottom: 0
          }}
        >
          <h1>{periodTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: periodInfoHtml }} />
          {/* <a href={post.frontmatter.learningGoals}>
            Learning Goals-{periodTitle}
          </a> */}
          <a href={post.frontmatter.learningGoals} target="_blank">
            <img style={{width:75}} src={goals} alt="Learning Goals-{periodTitle}" />
          </a>
        </div>
        {links.length > 0 && (
          <table>
            <tbody>{links}</tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        periodTitle
        title
        period
        date
        pageintro
        headertext
        learningGoals
      }
    }
    allMarkdownRemark {
      edges {
        node {
          html
          frontmatter {
            title
            period
            periodTitle
            date
            pageintro
            learningGoals
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

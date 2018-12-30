import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import linkExtractor from "../helpers/markdown-link-extractor";
import { getDateFromDkDate } from "../helpers/date_utils";

export default ({ data }) => {
  let days = data.allMarkdownRemark.edges.filter(
    ({ node }) => node.fields.belongsToPeriod
  );
  days = days.map(d => {
    const node = d.node;
    const dateForTitle = `${node.frontmatter.date}`;
    const rawMarkdownBody = node.rawMarkdownBody;
    const start =
      rawMarkdownBody.indexOf("<!---Exercises_begin-->") +
      "<!---Exercises_begin-->".length;
    const end = rawMarkdownBody.indexOf("<!---Exercises_end-->");
    let htmlLinks = null;
    if (start > -1 && end > -1 && end > start) {
      const exercises = rawMarkdownBody.substring(start, end);
      const links = linkExtractor(exercises);
      htmlLinks = links
        .map(l => `<a href=${l.href} target="_blank">${l.text}</a>`)
        .join(", ");
    }
    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      date: getDateFromDkDate(node.frontmatter.date),
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      period: node.fields.belongsToPeriod,
      htmlLinks
    };
  });
  days = days.filter(d => d.htmlLinks);
  days = days.sort((a, b) => a.date.getTime() - b.date.getTime());
  return (
    <Layout>
      <h2>List of all exercises</h2>
      <div>
        <table>
          <tbody>
            {days.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          rawMarkdownBody
          frontmatter {
            title
            date
            pageintro
          }
          fields {
            slug
            belongsToPeriod
          }
        }
      }
    }
  }
`;

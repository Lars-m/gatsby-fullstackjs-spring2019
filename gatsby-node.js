const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    
    const parts = slug.split("/");

    createNodeField({
      node,
      name: `slug`,
      value: slug
    });

    if (parts.length === 3 && node.fileAbsolutePath.includes("/index.md")) {
      createNodeField({
        node,
        name: `isPeriodDescription`,
        value: parts[1]
      });
    }

    if (parts.length > 3) {
      createNodeField({
        node,
        name: `belongsToPeriod`,
        value: parts[1]
      });
    }

    if (node.frontmatter.headertext) {
      createNodeField({
        node,
        name: `isSinglePageDocument`,
        value: true
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                isSinglePageDocument
                isPeriodDescription
                belongsToPeriod
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        if (node.fields.isSinglePageDocument) {
          //console.log("IS_SINGLE_PAGE")
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/single-page.js`),
            context: {
              // Data passed to context is available
              // in page queries as GraphQL variables.
              slug: node.fields.slug,
              isSinglePageDocument:node.fields.isSinglePageDocument
            }
          });
          //resolve();
        } 
        else if (node.fields.isPeriodDescription) {
          //console.log("IS_PERIOD_DESCRIPTION")
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/period-description-page.js`),
            context: {
              // Data passed to context is available
              // in page queries as GraphQL variables.
              slug: node.fields.slug,
              
            }
          });
          //resolve();
        } 
        else if (node.fields.belongsToPeriod) {
          //console.log("IS_BELONGS_TO_PERIOD")
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/blog-post.js`),
            context: {
              // Data passed to context is available
              // in page queries as GraphQL variables.
              slug: node.fields.slug,
              belongsToPeriod: node.fields.belongsToPeriod
            }
          });
          //resolve();
        } 
        else {
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/blog-post.js`),
            context: {
              // Data passed to context is available
              // in page queries as GraphQL variables.
              slug: node.fields.slug
            }
          });
        }
      });
      resolve();
    });
  });
};

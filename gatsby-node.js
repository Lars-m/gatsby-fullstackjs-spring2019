const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    //console.log("SLUG ",slug)
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
        
        let template = "`./src/templates/blog-post.js`"; //fallback
        if (node.fields.isPeriodDescription){
          template = `./src/templates/period-description-page.js`
        }
        else if (node.fields.belongsToPeriod){
          template = `./src/templates/blog-post.js`
        }
        else if(node.fields.belongsToPeriod){
          template = "`./src/templates/blog-post.js`";
        }
        
        if (node.fields.isSinglePageDocument) {
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/single-page.js`),
            context: {
              // Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,
              isSinglePageDocument:node.fields.isSinglePageDocument
            }
          });
        } 
        else  {
          createPage({
            path: node.fields.slug,
            component: path.resolve(template),
            context: {// Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,      
            }
          });
        } 
      });
      resolve();
    });
  });
};

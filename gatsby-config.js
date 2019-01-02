module.exports = {
  siteMetadata: {
    title1: `Full Stack JavaScript`,
    title2: `Spring 2019`
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-prismjs`]
      }
    },
    //`gatsby-plugin-typography`,{
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank"
              //rel: "nofollow"
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Full Stack Javascript Spring 2019",
        short_name: "FullStackJS",
        start_url: "/",
        background_color: "#6b37bf",
        theme_color: "#295683",
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/logo2.png" // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-offline"
  ]
};

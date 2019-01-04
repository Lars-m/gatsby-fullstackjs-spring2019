import React from "react";
import "react-icons";

//import logo from "./bitmap.png";
import logo from "../../images/logo.png";
import { StaticQuery, Link, graphql } from "gatsby";

import "../../images/css/font-awesome.css"
import "../../style.css";
import all from "../helpers/periodLinks";
const linksForAllPeriods = all.linkFacade.getLinksForAllPeriods;
const setCurrentPeriod = all.linkFacade.setCurrentPeriod;
const getLinksForCurrentPeriod = all.linkFacade.getLinksForCurrentPeriod;

//Refactor to utils (also used in blog-post)
function getPeriodfromSlug(slug) {
  //We don't care about index.md files so a minimum of three "/" must be present
  //A slug could be: "/period1/day2/"
  return `${slug.split("/")[1]}`;
}

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark {
          edges {
            node {
              id
              frontmatter {
                periodTitle
                period
                date
              }
              fields {
                slug
              }
            }
          }
        }
        site {
          siteMetadata {
            title1
            title2
          }
        }
      }
    `}
    render={data => {
      const map = linksForAllPeriods(data.allMarkdownRemark.edges);
      //console.log("MAP -->", map);
      const subLinks = getLinksForCurrentPeriod();
      const subLinksHTML = subLinks.map((n, index) => {
        const slug = n.node.fields.slug;
        //console.log("SLUG--->", slug);
        return (
          <React.Fragment key={n.id}>
            <Link key={n.id} to={slug} activeClassName="active">
              <span id={getPeriodfromSlug(slug)}>
                {n.node.frontmatter.date}
              </span>
            </Link>
          </React.Fragment>
        );
      });

      const nodes = data.allMarkdownRemark.edges;

      let periods = nodes
        .filter(n => n.node.frontmatter.periodTitle)
        .map(n => {
          const slug = getPeriodfromSlug(n.node.fields.slug);
          return {
            id: n.node.id,
            slug: `/${slug}/`,
            period: n.node.frontmatter.period || slug
          };
        });
      periods.sort((a, b) => (a.period >= b.period ? 1 : -1));
      const links = periods.map(p => (
        <React.Fragment key={p.id}>
          <Link key={p.id} to={`${p.slug}`} activeClassName="active">
            <span id={p.slug.split("/")[1]}>{p.period} </span>
          </Link>
        </React.Fragment>
      ));
      //  const periods = edges.map(e=><Link to = '/{e.node.relativePath}'>{e.node.relativePath}</Link>);

      return (
        <div
          //This is "hacky", but it gets the id from the inner span in a-tags
          onClick={e => {
            let tagName = e.target.tagName.toUpperCase();
            //console.log("TagName", tagName, e.target.innerText, e.target.id);
            if (
              tagName === "A" &&
              e.target.children[0] &&
              e.target.children[0].tagName === "SPAN"
            ) {
              setCurrentPeriod(e.target.children[0].id);
            } else if (tagName === "SPAN") {
              setCurrentPeriod(e.target.id);
              //console.log("000000", e.target.innerText, e.target.id);
            }
            else{
              setCurrentPeriod("-")
            }
          }}
        >
          <div className="header">
            <div className="title">
              <img src={logo} alt="Logo"/>
              <div style={{ alignSelf: "flex-start", marginLeft: "2em" }}>
                <h1 >{data.site.siteMetadata.title1}</h1>
                <p >{data.site.siteMetadata.title2}</p>
              </div>
            </div>
            <div className="main-links">
              <Link to={`/`} activeClassName="active">
                Schedule
              </Link>
              <Link to={`/all-links`} activeClassName="active">
                Exercises
              </Link>
              <Link to={`/all-readings`} activeClassName="active">
                Read/watch
              </Link>
              <Link to={`/about/`} activeClassName="active">
                About
              </Link>
            </div>
          </div>

          <div style={{ marginLeft: "auto", marginRight: "auto", width: "90%" }}>
            <div className="period-links">{links}</div>
            <div className="link-days">{subLinksHTML}</div>
            <div> {children}</div>
          </div>
        </div>
      );
    }}
  />
);

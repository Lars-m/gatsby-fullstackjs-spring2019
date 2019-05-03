import React from "react";
import Modal from "./Modal";
//import logo from "./bitmap.png";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
import { StaticQuery, Link, graphql } from "gatsby";

import "../../images/css/font-awesome.css";
import "../../style.css";
import all from "../helpers/periodLinks";
const { getLinksForAllPeriods, setCurrentPeriod, getLinksForCurrentPeriod } = all.linkFacade;

function getPeriodfromSlug(slug) {
  //We don't care about index.md files so a minimum of three "/" must be present
  //A slug could be: "/period1/day2/"
  return `${slug.split("/")[1]}`;
}

class Container extends React.Component {
  constructor(props) {
    super(props);
    //necessary since first time it executes it's done by node and not in a browser
    this.state = { offline: false, showModal: false };
  }

  componentDidMount() {
    
    window.addEventListener("click", this.clicked);
    window.addEventListener("online", this.setOffline);
    window.addEventListener("offline", this.setOffline);
    this.setOffline();
  }
  componentWillUnmount() {
    window.removeEventListener("online", this.setOffline);
    window.removeEventListener("offline", this.setOffline);
    window.removeEventListener("click", this.clicked);
    this.setOffline();
  }

  /* Disable outgoing links when off-line */
  clicked = e => {
    if (this.state.offline && e.target.tagName.toUpperCase() === "A") {
      if (!e.target.getAttribute("href").startsWith("/")) {
        e.preventDefault();
        this.setState({ showModal: true });
        setTimeout(() => this.setState({ showModal: false }), 2000);
      }
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  setOffline = () => {
    this.setState({ offline: !navigator.onLine });
  };

  render() {
    //console.log("STATE", this.state);
    const data = this.props;
    {
      //const map = linksForAllPeriods(data.allMarkdownRemark.edges);
      getLinksForAllPeriods(data.allMarkdownRemark.edges);
      const subLinks = getLinksForCurrentPeriod();
      const subLinksHTML = subLinks.map((n, index) => {
        const slug = n.node.fields.slug;
        //console.log("SLUG--->", slug);
        return (
          <React.Fragment key={index}>
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
            } else {
              setCurrentPeriod("-");
            }
          }}
        >
          <div className="header">
            <div className="title">
              <img src={logo} alt="Logo" />
              <div style={{ alignSelf: "flex-start", marginLeft: "2em" }}>
                <h1>{data.site.siteMetadata.title1}</h1>
                <p>{data.site.siteMetadata.title2}</p>
              </div>
            </div>
            <div className="main-links">
              <a href="https://docs.google.com/document/d/1JeVxni4WxM2Kli7Nu68uioooiq4PnYOEeb1ZzMyQvsk/edit?usp=sharing" 
                 activeClassName="active"
                 target="_blank">
                Snippet
              </a>
              <a href="https://studypoints.dk" target="_blank" activeClassName="active">
                StudyPoints
              </a>
              <Link to={`/full-schedule`} activeClassName="active">
                Schedule
              </Link>
              <Link to={`/all-links`} activeClassName="active">
                Exercises
              </Link>
              
              <Link to={`/all-readings`} activeClassName="active">
                Read
              </Link>
              <Link to={`/`} activeClassName="active">
                About
              </Link>
            </div>
          </div>

          <div className="content-frame" >
            <div className="period-links">
              {links}
              {/* HACK to ensure icon is preloaded while online*/}
              <img style={{ width: 1 }} src={offline} alt="dummy" />{" "}
              {this.state.offline && (
                <img className="online" src={offline} alt="off-line" />
              )}
            </div>
            <div className="link-days">{subLinksHTML}</div>
            <Modal
              key={this.state.showModal}
              header="Off-line"
              body="You are currently off-line"
              show={this.state.showModal}
              onClose={this.closeModal}
            />
            <div> {this.props.children}</div>
          </div>
        </div>
      );
    }
  }
}

export default ({ children }) => (
  <StaticQuery
    query={query}
    render={data => (<Container {...data} children={children} />)}
  />
);

var query = graphql`
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
`;

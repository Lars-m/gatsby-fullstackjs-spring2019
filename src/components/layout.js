import React from "react";
//import "react-icons";

//import logo from "./bitmap.png";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
import { StaticQuery, Link, graphql } from "gatsby";

import "../../images/css/font-awesome.css";
import "../../style.css";
import "../../modalStyle.css";
import all from "../helpers/periodLinks";
const linksForAllPeriods = all.linkFacade.getLinksForAllPeriods;
const setCurrentPeriod = all.linkFacade.setCurrentPeriod;
const getLinksForCurrentPeriod = all.linkFacade.getLinksForCurrentPeriod;

class Modal extends React.Component {
  constructor(props) {
    super(props);
    let visible = this.props.show ? "block" : "hide";
    this.state = { visible, showModal: false };
  }

  componentDidMount() {
    //this.setState({ visible: "block" });
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { header, body } = this.props;
    return (
      <div
        id="myModal"
        className="modal"
        style={{ display: `${this.state.visible}` }}
      >
        {/*<!-- Modal content --> */}
        <div className="modal-content">
          <div className="modal-header" onClick={this.close}>
            <span onClick={this.close} className="close">
              &times;
            </span>
            <h2>{header}</h2>
          </div>
          <div className="modal-body">{body}</div>
        </div>
      </div>
    );
  }
}

//Refactor to utils (also used in blog-post)
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

  clicked = e => {
    //Disable outgoing links when off-line
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
    const status = !navigator.onLine;
    console.log("Status", status);
    this.setState({ offline: status });
  };

  render() {
    console.log("STATE", this.state);
    const data = this.props;
    {
      //const map = linksForAllPeriods(data.allMarkdownRemark.edges);
      linksForAllPeriods(data.allMarkdownRemark.edges);
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

          <div
            style={{ marginLeft: "auto", marginRight: "auto", width: "90%" }}
          >
            <div className="period-links">
              {links}
              {/* HACK to ensure icon is preloaded while online*/}
              <img style={{ width: 1 }} src={offline} alt="dummy" />{" "}
              {this.state.offline && <img className="online" src={offline} alt="off-line" />}
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
      return <Container {...data} children={children} />;
    }}
  />
);

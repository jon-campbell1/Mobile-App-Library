import React, { Component, Fragment } from 'react';
import ReactPullToRefresh from 'react-pull-to-refresh';
import data from '../data/data.json';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import { PlayCircle, Link, Download } from "react-feather";
class MainLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
      err: false
    }
  }

  copy = (campaignInd, mediaInd) => {
    let trackingInput = document.getElementById("trackingLink:" + campaignInd + "" + mediaInd);
    trackingInput.select();
    document.execCommand("copy");
    alert("Link Copied to Clipboard!");
  }

  playVideo = (campaignInd, mediaInd) => {
    document.getElementById("video" + campaignInd + "" + mediaInd).style.display = "block";
    document.getElementById("playControls" + campaignInd + "" + mediaInd).style.display = "none";
    document.getElementById("video" + campaignInd + "" + mediaInd).play();
  }

  pauseVideo = (campaignInd, mediaInd) => {
    document.getElementById("video" + campaignInd + "" + mediaInd).pause();
    document.getElementById("video" + campaignInd + "" + mediaInd).style.display = "none";
    document.getElementById("playControls" + campaignInd + "" + mediaInd).style.display = "block";
  }

  handleRefresh(resolve, reject) {
    window.location.reload();
  }

  componentDidMount() {
    fetch("https://www.plugco.in/public/take_home_sample_feed")
      .then(data => data.json())
      .then(res => {
        this.setState({
          campaigns: res.campaigns
        })
      }).catch(err => {
         alert("Failed to Fetch Data");
         this.setState({
           err: true
         });
      });
  }

  render() {
    return (
      <Fragment>
        <ReactPullToRefresh onRefresh={this.handleRefresh} style={{display: (this.state.err ? "none" : "")}}>
            <div id="refreshDiv"><div style={{position: "relative", top: "12px"}}>Pull to Refresh</div></div>
        </ReactPullToRefresh>
      <Row>
        <div className="text-center mt-5" style={{width: "100%", display: (this.state.err ? "" : "none")}}>
          <input type="button" onClick={() => {window.location.reload()}} value="Try Again"/>
        </div>
        {this.state.campaigns.map((campaign, campaignInd) =>
          <Col xs="12" sm="6" lg="4">
          <Card style={{border: "1px solid #e7f2f5"}}>
            <CardHeader style={{background: "white", border: "1px solid #e7f2f5"}}>
              <div className="campaignIcon" style={{background:"url(" + campaign.campaign_icon_url + ")", backgroundSize: "cover"}}></div>
              <div className="campaignInfo">
                <b>{campaign.campaign_name}</b>
                <div className="campaignInstalls"><b>{campaign.pay_per_install}</b> pays per install</div>
              </div>
            </CardHeader>
            <CardBody style={{background: "#f7fbfc", paddingLeft: "0px", paddingRight: "0px"}}>
                <div className="mediaContainer">
                  {campaign.medias.map((media, mediaInd) =>
                    <div className="photoContainer">
                      <div className="mediaPhoto" style={{background:"url(" + media.cover_photo_url + ")", backgroundSize: "cover"}}>
                        <video width="100" height="185"  preload="auto" onClick={() => {this.pauseVideo(campaignInd, mediaInd)}} style={{display: "none", cursor: "pointer"}} id={"video" + campaignInd + "" + mediaInd}>
                          <source src={media.download_url} type="video/mp4"/>
                        </video>
                        <span id={"playControls" + campaignInd + "" + mediaInd}>
                        <PlayCircle className="playCircle" onClick={() => {this.playVideo(campaignInd, mediaInd)}} color="white" size={40} style={{display: (media.media_type != "video" ? "none" : "")}}/>
                        <div className="previewCover" onClick={() => {this.playVideo(campaignInd, mediaInd)}}></div>
                        </span>
                      </div>
                      <div className="actionButton" style={{borderRadius: "5px 0 0 5px"}} onClick={() => {this.copy(campaignInd, mediaInd)}}>
                        <input type="text" className="linkInput" id={"trackingLink:" + campaignInd + "" + mediaInd} readOnly value={media.tracking_link}/>
                        <Link color="grey" size={25} style={{marginTop: "12px", marginLeft: "12px"}} />
                      </div>
                      <div className="actionButton" style={{borderRadius: "0 5px 5px 0"}}>
                        <a href={media.download_url} target="_blank" download><Download color="grey" size={25} style={{marginTop: "12px", marginLeft: "12px"}}/></a>
                      </div>
                    </div>
                  )}
                </div>
            </CardBody>
          </Card>
          </Col>
        )}
      </Row>
      </Fragment>
    );
  }

}

export default MainLayout;

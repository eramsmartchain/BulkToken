import React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import GithubCorner from "react-github-corner";
import Web3Utils from "web3-utils";
import getWeb3 from "../getWeb3";
// import Logo from "/images/logo.png";

export class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="multisend-container">
          <div className="flex flex-wrap gap-20 md:flex-row flex-col">
            <div className="flex flex-col lg:flex-3">
              <div className="flex gap-20 mb-30 items-center">
                <div>
                  <img src="images/logo_footer.png" />
                </div>
                <h4>Power by ERAM Smart Chain</h4>
              </div>
              <p className="mb-30">
                EramDrop is a software tool that allows users to send multiple
                tokens to various recipients quickly and efficiently
              </p>
              <div className="flex flex-wrap gap-15 mb-30">
                <a
                  href="https://eramscan.com/"
                  className="flex gap-5 flex-[50%] sm:flex-auto"
                  target="_blank"
                >
                  <img src="images/ZedScanIcon.svg"></img>
                  <span>EramScan</span>
                </a>
                <a
                  href="https://eramdex.com/"
                  className="flex gap-5 flex-[50%] sm:flex-auto"
                  target="_blank"
                >
                  <img src="images/ZedDexIcon.svg"></img>
                  <span>EramDex</span>
                </a>
                <a
                  href="https://erambridge.com"
                  className="flex gap-5 flex-[50%] sm:flex-auto"
                  target="_blank"
                >
                  <img src="images/ZedBridgeIcon.svg"></img>
                  <span>EramBridge</span>
                </a>
              </div>
              <div className="flex flex-wrap gap-20 items-center">
                <a
                  className="flex items-center"
                  href="https://www.facebook.com/zedxioncoin"
                  target="_blank"
                >
                  <img src="images/FacebookIcon.svg"></img>
                </a>
                <a
                  className="flex items-center"
                  href="https://x.com/zedxionc"
                  target="_blank"
                >
                  <img src="images/TwitterIcon.svg"></img>
                </a>
                <a
                  className="flex items-center"
                  href="https://www.instagram.com/zedxion/"
                  target="_blank"
                >
                  <img src="images/InstagramIcon.svg"></img>
                </a>
                <a className="flex items-center" href="https://www.youtube.com/channel/UCVbVWWdHHrpRkRL80_CoDZg" target="_blank">
                  <img src="images/YoutubeIcon.svg"></img>
                </a>
                <a className="flex items-center" href="https://discord.com/invite/UDDb7FZF" target="_blank">
                  <img src="images/DiscordIcon.svg"></img>
                </a>
                <a
                  className="flex items-center"
                  href="https://medium.com/@zedxion_exchange/subscribe"
                  target="_blank"
                >
                  <img src="images/MediumIcon.svg"></img>
                </a>
                <a className="flex items-center" href="https://www.linkedin.com/company/zedxion-exchnage-crypto/" target="_blank">
                  <img src="images/LinkedinIcon.svg"></img>
                </a>
              </div>
            </div>
            <div className="flex flex-col lg:flex-1 text-sm">
              <h5 className="mb-24">Company</h5>
              <a href="#" className="mb-12">
                Delegate to EramScan
              </a>
              <a href="#" className="mb-20">
                <span className="btn-staking">Staking</span>
              </a>
              <a href="#" className="mb-20">
                Brand Assets
              </a>
              <a href="#" className="mb-20">
                Contact Us
              </a>
              <a href="#" className="mb-20">
                Terms & Privacy
              </a>
              <a href="#" className="mb-20">
                Bug Bounty
              </a>
            </div>
            <div className="flex flex-col lg:flex-1 min-w-[150px] text-sm">
              <h5 className="mb-24">Community</h5>
              <a href="#" className="mb-20">
                API Documentation
              </a>
              <a href="#" className="mb-20">
                Knowledge Base
              </a>
              <a href="#" className="mb-20">
                Network Status
              </a>
              <a
                href="#"
                className="mb-20"
                target="_blank"
              >
                Learn ERAM
              </a>
            </div>
            <div className="flex flex-col lg:flex-1 text-sm">
              <h5 className="mb-24">Products & Services</h5>
              <a href="#" className="mb-20">
                Advertise
              </a>
              <a href="#" className="mb-20">
                Explorer-as-a-Service (EaaS)
              </a>
              <a href="#" className="mb-20">
                API Plans
              </a>
              <a href="#" className="mb-20">
                Priority Support
              </a>
              <a href="#" className="mb-20">
                Blockscan
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-20 py-20">
            <p>ERAM Chain © 2024</p>
            <p>|</p>
            <a
              href="#"
              target="_blank"
              className="text-whitepaper"
            >
              WhitePaper
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

import React from "react";
import "./footer.css";
import { FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { PiInstagramLogoFill } from "react-icons/pi";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; 2024 Your E-Learning Platform. All rights reserved. <br />
          Made with ❤ <a href="https://github.com/SudhansuSekharJena">Sudhansu Sekhar Jena</a>
        </p>
        <div className="social-links">
          <a href=""><FaLinkedin/></a>
          <a href=""><FaSquareXTwitter/></a>
          <a href=""><PiInstagramLogoFill/></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

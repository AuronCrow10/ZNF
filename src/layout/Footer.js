import Link from "next/link";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer">
          <div className="left_part">
            <p>
              Copyright 2024 — Designed &amp; Developed by{" "}
              <a
                href="https://www.fiverr.com/auroncrow/create-smart-contracts-nfts-token-dapp"
                target="_blank"
                rel="noreferrer"
              >
                AuronCrow
              </a>
            </p>
          </div>
          <div className="right_part"></div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

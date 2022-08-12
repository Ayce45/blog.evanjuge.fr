import Container from "@components/container";
import ThemeSwitch from "@components/themeSwitch";
import Image from "next/image";
import { myLoader } from "@utils/all";
import VercelLogo from "../public/img/vercel.svg";

export default function Footer(props) {
  return (
    <Container className="mt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="text-sm text-center">
        Copyright © {new Date().getFullYear()} {props?.copyright}. Tous droits réservés.
      </div>
      <div className="mt-1 text-sm text-center">
        Réalisé avec{" "}
        {/*  // ** 🙏  Can I ask you a favor? 🙏 **
            // Please do not remove the below link.
           // It helps us to grow & continue our work. Thank you.
          // OR contact hello@web3templates.com for commercial license.  */}
        <a
          href="https://www.web3templates.com/?ref=stablo-template"
          rel="noopener"
          target="_blank">
          Web3Templates
        </a>
        {/* Do not remove above link */}
      </div>
        <ThemeSwitch />
    </Container>
  );
}

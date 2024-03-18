import React, { useEffect } from "react";
import moment from "moment";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FooterComp = () => {
  useEffect(() => {
    gsap.from(".myh6", {
      scrollTrigger: {
        trigger: ".myh6",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 100,
      duration: 2,
    });
  }, []);

  return (
    <div className="bg-black text-white footer">
      <div className="">
        <h6 className="myh6">
          {" "}
          Copyright © <strong className="text-primary bounce">
            Amann
          </strong>{" "}
          {moment().format("YYYY")}, All rights reserved
        </h6>
      </div>
    </div>
  );
};

export default FooterComp;

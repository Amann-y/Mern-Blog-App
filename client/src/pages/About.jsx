import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  return (
    <div className="gsap_container">
      <div className="gsap_main">
        <section className="gsap_section">Scroll Down</section>

        <div className="gsap_text-wrapper">
          <p>I'm Amann Yadav. I'm a web-developer aka Programmer</p>
          <p>I graduated from Medicaps Institute of technology in 2013</p>
          <p>
            I have a bachelor's degree in the field of Electronics &
            Instrumentation
          </p>
          <p>
            I once worked at Solar power plant. I am and have always been
            fascinated by Web-applications, Apps, Software and much more
          </p>
          <p>I love using and learning new and old technology</p>
          <p>
            Now I am a full time Web-Developer. So far I've created many
            web-projects
          </p>
        </div>
        <section  className="gsap_section">Scroll Up</section>
      </div>
    </div>
  );
};

export default About;
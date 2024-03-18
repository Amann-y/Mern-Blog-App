import React, { useEffect } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

const Home = () => {
  let mm = gsap.matchMedia();

  useEffect(() => {
    mm.add("(max-width: 799px)", () => {
      gsap.registerPlugin(TextPlugin);
      const tl = gsap.timeline({ repeat: -1 }); // Set repeat to -1 for infinite loop
      tl.to(".myh1", {
        duration: 2,
        text: "This is created by Amann",
        delay: 3,
        fontSize: 30,
        textAlign: "center",
        ease: "circ.out",
        repeat: 1, // Set repeat to 1 for the text to revert back to the original
        yoyo: true, // Yoyo will play the animation in reverse after reaching the end
        repeatDelay: 1, // Delay before starting the next iteration
      });
    });

    mm.add("(min-width: 800px)", () => {
      gsap.registerPlugin(TextPlugin);
      const tl = gsap.timeline({ repeat: -1 }); // Set repeat to -1 for infinite loop
      tl.to(".myh1", {
        duration: 2,
        text: "This is created by Amann",
        delay: 3,
        ease: "circ.out",
        repeat: 1, // Set repeat to 1 for the text to revert back to the original
        yoyo: true, // Yoyo will play the animation in reverse after reaching the end
        repeatDelay: 1, // Delay before starting the next iteration
      });
    });
  }, []);
  mm.revert();

  return (
    <>
      <div className="masthead">
        <div className="color-overlay d-flex justify-content-center align-items-center">
          <h1 className="myh1">Home</h1>
        </div>
      </div>
    </>
  );
};

export default Home;

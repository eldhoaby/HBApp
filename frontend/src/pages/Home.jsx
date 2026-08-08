// import React, { useRef, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Hero from "../components/Hero";
// import FeaturedDestination from "../components/FeaturedDestination";
// import Testimonial from "../components/Testimonial";
// import Footer from "../components/Footer";

// const Home = () => {
//   const location = useLocation();
//   const scrollTo = new URLSearchParams(location.search).get("scrollTo");

//   const heroRef = useRef(null);
//   const testimonialRef = useRef(null);
//   const footerRef = useRef(null);

//   useEffect(() => {
//     if (scrollTo === "hero" && heroRef.current) {
//       heroRef.current.scrollIntoView({ behavior: "smooth" });
//     } else if (scrollTo === "testimonial" && testimonialRef.current) {
//       testimonialRef.current.scrollIntoView({ behavior: "smooth" });
//     } else if (scrollTo === "footer" && footerRef.current) {
//       footerRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [scrollTo]);

//   return (
//     <>
//       <div ref={heroRef}>
//         <Hero />
//       </div>
//       <FeaturedDestination />
//       <div ref={testimonialRef}>
//         <Testimonial />
//       </div>
//       <div ref={footerRef}>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Home;

import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import Recommendations from "../components/Recommendations";

const Home = () => {
  const location = useLocation();
  const scrollTo = new URLSearchParams(location.search).get("scrollTo");

  const heroRef = useRef(null);
  const testimonialRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (scrollTo === "hero" && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTo === "testimonial" && testimonialRef.current) {
      testimonialRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTo === "footer" && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollTo]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div ref={heroRef}>
        <Hero />
      </div>
      <Recommendations />
      <FeaturedDestination />
      <div ref={testimonialRef}>
        <Testimonial />
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import Banner from "../../Components/HomePageComponents/Banner";
import StudySessions from "../../Components/HomePageComponents/StudySessions";
import WhyChooseUs from "../../Components/HomePageComponents/WhyChooseUs";
import HowItWorks from "../../Components/HomePageComponents/HowItWorks";

const Home = () => {
  return (
    <div>
      <Banner />
      <StudySessions />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  );
};

export default Home;

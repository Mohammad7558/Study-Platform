import React from "react";
import Banner from "../../Components/HomePageComponents/Banner";
import StudySessions from "../../Components/HomePageComponents/StudySessions";
import WhyChooseUs from "../../Components/HomePageComponents/WhyChooseUs";
import HowItWorks from "../../Components/HomePageComponents/HowItWorks";
import { FAQ } from "../../Components/HomePageComponents/FAQ";
import { ContactForm } from "../../Components/HomePageComponents/ContactForm";
import ExtraSections from "../../Components/HomePageComponents/ExtraSections";

const Home = () => {
  return (
    <div>
      <Banner />
      <StudySessions />
      <WhyChooseUs />
      <HowItWorks />
      <FAQ/>
      <ExtraSections/>
      <ContactForm/>
    </div>
  );
};

export default Home;

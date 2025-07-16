import React from "react";
import Banner from "../../Components/HomePageComponents/Banner";
import StudySessions from "../../Components/HomePageComponents/StudySessions";
import WhyChooseUs from "../../Components/HomePageComponents/WhyChooseUs";
import HowItWorks from "../../Components/HomePageComponents/HowItWorks";
import { FAQ } from "../../Components/HomePageComponents/FAQ";
import { ContactForm } from "../../Components/HomePageComponents/ContactForm";

const Home = () => {
  return (
    <div>
      <Banner />
      <StudySessions />
      <WhyChooseUs />
      <HowItWorks />
      <FAQ/>
      <ContactForm/>
    </div>
  );
};

export default Home;

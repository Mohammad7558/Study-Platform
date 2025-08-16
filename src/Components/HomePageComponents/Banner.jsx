import React from 'react';
import img from '../../assets/Banner.jpg';

const Banner = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center py-10 lg:py-24 md:py-24">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-snug">
            Empower Your Learning Journey
          </h1>
          <p className="text-gray-600 text-lg md:text-[16px] md:pr-20 lg:pr-40 md:px-0 px-6">
            Join our Collaborative Study Platform to connect with mentors, explore resources, and grow your skills in a vibrant learning community.
          </p>
          <button className="px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition duration-300 font-medium">
            Get Started
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mb-5 md:mb-0 lg:ml-10 px-5 md:px-0 lg:px-0">
          <img
            src={img}
            alt="Collaborative learning"
            className="w-full rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
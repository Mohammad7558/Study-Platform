import React from "react";
import { MdLogin, MdGroupAdd, MdEventAvailable } from "react-icons/md";

const HowItWorks = () => {
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          Getting started is simple. Follow these three steps and dive into collaborative learning.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <MdLogin className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">1. Sign Up / Log In</h4>
            <p className="text-gray-600">
              Create your account in seconds using email or Google.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <MdGroupAdd className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">2. Join a Session</h4>
            <p className="text-gray-600">
              Browse available sessions and register to join ongoing discussions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
            <MdEventAvailable className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">3. Learn & Collaborate</h4>
            <p className="text-gray-600">
              Attend live sessions, interact with peers, and grow your knowledge base.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

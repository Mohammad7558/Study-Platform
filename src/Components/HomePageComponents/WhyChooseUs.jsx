import React from "react";
import { FaChalkboardTeacher, FaUsers, FaClock } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Why Choose Collaborative Study Platform?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          We bring learners, tutors, and study enthusiasts together in one powerful and flexible space — designed for effective learning and collaboration.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
            <FaChalkboardTeacher className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Expert-Led Sessions</h4>
            <p className="text-gray-600">
              All sessions are led by experienced tutors and professionals who ensure hands-on learning.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
            <FaUsers className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Peer Collaboration</h4>
            <p className="text-gray-600">
              Collaborate with fellow learners through group sessions, chat, and live discussions.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
            <FaClock className="text-cyan-600 text-4xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Flexible Scheduling</h4>
            <p className="text-gray-600">
              Choose from a variety of study sessions that suit your pace and availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

import React from 'react';

const sessions = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Learn the fundamentals of React including components, props, and state.',
    endDate: '2025-07-15',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Deep dive into closures, async/await, and ES6 features.',
    endDate: '2025-07-05',
  },
  {
    id: 3,
    title: 'MongoDB for Beginners',
    description: 'Understand how NoSQL databases work and how to perform basic operations.',
    endDate: '2025-07-25',
  },
  {
    id: 4,
    title: 'CSS Flexbox & Grid',
    description: 'Master layout techniques with hands-on practice.',
    endDate: '2025-07-01',
  },
  {
    id: 5,
    title: 'Node.js Crash Course',
    description: 'Build fast and scalable backend applications using Node.js.',
    endDate: '2025-07-20',
  },
  {
    id: 6,
    title: 'Firebase Authentication',
    description: 'Integrate secure login systems with Firebase.',
    endDate: '2025-07-12',
  },
];

const StudySessions = () => {
  const currentDate = new Date();

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Available Study Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => {
            const isClosed = new Date(session.endDate) < currentDate;
            return (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {session.title}
                </h3>
                <p className="text-gray-600 mb-4">{session.description}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    isClosed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}
                >
                  {isClosed ? 'Closed' : 'Ongoing'}
                </span>
                <div>
                  <button className="mt-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition text-sm">
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudySessions;

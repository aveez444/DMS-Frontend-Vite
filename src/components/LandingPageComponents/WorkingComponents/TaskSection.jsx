import React from "react";
import { FaTasks, FaUsers, FaChartLine } from "react-icons/fa";

const TaskSection = () => {
  const tasks = [
    {
      title: "Assign Tasks",
      icon: <FaTasks className="text-3xl text-red-500" />,
      description: "Delegate work to your team with ease.",
    },
    {
      title: "Collaborate with your Team",
      icon: <FaUsers className="text-3xl text-blue-500" />,
      description: "Work together seamlessly for better results.",
    },
    {
      title: "Track Progress",
      icon: <FaChartLine className="text-3xl text-green-500" />,
      description: "Monitor your team's performance in real-time.",
    },
  ];

  return (
    <section
      className="relative py-16"
      style={{
        backgroundImage: "url(/path/to/bggradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-black">
          Effortless work with your team to keep track of your most important tasks
        </h2>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-3">{task.icon}</div>
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
              {/* Description */}
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TaskSection;

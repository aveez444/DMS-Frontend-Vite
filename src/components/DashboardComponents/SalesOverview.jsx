import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SalesOverview = () => {
  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Sales",
        data: [12, 8, 10, 34, 20, 15, 22],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
        hoverBackgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `Sales: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#e5e5e5",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div
      className="mx-auto p-4 bg-white rounded-lg shadow-md"
      style={{
        width: "100%",
        maxWidth: "95%", // Default for mobile
        height: "auto", // Allow height to adjust dynamically
      }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Sales Overview</h2>
      <div
        className="relative"
        style={{
          width: "100%",
          height: "300px", // Base height for small screens
          maxWidth: "711px", // Constrain max width for larger screens
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesOverview;

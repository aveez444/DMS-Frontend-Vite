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
        data: [12, 8, 10, 34, 20, 15, 22], // Example sales data
        backgroundColor: "rgba(90, 129, 249, 0.8)", // Matches the bar color
        hoverBackgroundColor: "rgba(90, 129, 249, 1)", // Stronger on hover
        borderRadius: 8, // Slightly rounded corners
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
          label: (tooltipItem) => `Sales: ${tooltipItem.raw}`, // Show value in tooltip
        },
      },
      legend: {
        display: false, // Hides the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // No grid lines for X-axis
        },
        ticks: {
          font: {
            size: 14, // Slightly larger font for labels
            weight: "500",
          },
          color: "#000", // Black text for labels
        },
        barPercentage: 0.2, // Adjusts bar width
        categoryPercentage: 0.2, // Adjusts spacing between bars
      },
      y: {
        grid: {
          color: "#e5e5e5", // Subtle grid lines for Y-axis
        },
        ticks: {
          beginAtZero: true,
          stepSize: 10, // Y-axis steps
          font: {
            size: 14,
          },
          color: "#000", // Black text for Y-axis
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "750px", // Width to match the image
        height: "400px", // Height to align visually
        margin: "20px auto", // Centered horizontally
        padding: "20px",
        background: "#f9fbfc", // Matches the light background
        borderRadius: "12px", // Subtle rounding
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Slight shadow
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Sales Overview</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <span style={{ color: "#555" }}>This Month</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ width: "16px", height: "16px", color: "#555" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: "300px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesOverview;

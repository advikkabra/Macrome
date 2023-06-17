import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Heading, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};
function reverseList(l) {
  let final = [];

  for (let i = l.length - 1; i >= 0; i--) {
    final.push(l[i]);
  }
  return final;
}

function getMacro(l, macroName) {
  let macroList = [];
  for (let i = 0; i < l.length; i++) {
    macroList.push(l[i][macroName]);
  }
  console.log(macroList);
  return reverseList(macroList);
}

export function Graph(props) {
  const labels = [
    "6 days ago",
    "5 days ago",
    "4 days ago",
    "3 days ago",
    "2 days ago",
    "1 day ago",
    "Today",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Calories",
        data: getMacro(props.week, "calories_percent"),
        borderColor: "#8ebfa1",
        backgroundColor: "#8ebfa1",
        borderWidth: 3,
        tension: 0.2,
      },
      {
        label: "Protein",
        data: getMacro(props.week, "protein_percent"),
        borderColor: "#ecbdbd",
        backgroundColor: "#ecbdbd",
        borderWidth: 3,
        tension: 0.2,
      },
      {
        label: "Carbohydrates",
        data: getMacro(props.week, "carbs_percent"),
        borderColor: "#ac9bcc",
        backgroundColor: "#ac9bcc",
        borderWidth: 3,
        tension: 0.2,
      },
      {
        label: "Fat",
        data: getMacro(props.week, "fat_percent"),
        borderColor: "#e3c6a5",
        backgroundColor: "#e3c6a5",
        borderWidth: 3,
        tension: 0.2,
      },
      {
        label: "Sodium",
        data: getMacro(props.week, "sodium_percent"),
        borderColor: "#51a1b0",
        backgroundColor: "#51a1b0",
        borderWidth: 3,
        tension: 0.2,
      },
    ],
  };

  return <Line options={options} data={data} />;
}


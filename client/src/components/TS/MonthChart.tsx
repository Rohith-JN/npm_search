import React, { useEffect, useState, FC } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../Styles/MonthChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthChartProps {
  input: string;
}

const MonthChart: FC<MonthChartProps> = ({ input }) => {
  const options: any = {
    bezierCurve: true,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Downloads last month',
      },
    },
  };

  const data = {
    labels: [] as any[],
    datasets: [
      {
        label: '',
        data: [] as any[],
        pointRadius: 0,
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.4,
      },
    ],
  };

  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });
  const [error, setError] = useState({
    error: false,
    errorMessage: '',
    errorCode: 200,
  });

  const fetchPackageInfo = async (input: string) => {
    const response = await fetch(`/charts?chart=month&package=${input}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      setError({
        error: true,
        errorMessage: data.errorMessage,
        errorCode: data.errorCode,
      });
    }
    else {
      setChartData({
        labels: data.downloads.map((item: any) => String(item.day).slice(-2)),
        data: data.downloads.map((item: any) => item.downloads),
      });
    }
  };

  useEffect(() => {
    fetchPackageInfo(input);
  }, [input]);

  data.labels = chartData.labels;
  data.datasets[0].data = chartData.data;
  data.datasets[0].label = input;

  return (
    <div className="MonthChart" id="MonthChart">
      {error.error ? (
        <article className="content">
          <p>
            <strong>Error ({error.errorCode})</strong>
          </p>
          <p>{error.errorMessage}</p>
        </article>
      ) : (
        <Line options={options} data={data} />
      )}
    </div>
  );
}

export default MonthChart;
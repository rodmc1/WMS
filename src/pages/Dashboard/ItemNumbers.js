
import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

const NumberOfItems = (props) => {
  const [data, setData] = useState('');
  const [chartData, setChartData] = useState(null);
  const [barColors, setColors] = useState([]);

  const getColors = () => {
    let color = [];
    let saturation = 0;
    let lightness = 0;

    console.log(chartData)
    chartData.value.forEach(() => {
      saturation = saturation + 6;
      lightness = lightness + 7;
      color.push(`hsl(169, ${50 - saturation}%, ${lightness + 50}%)`)
    });

    setColors(color);
  }

  useEffect(() => {
    if (chartData) {
      getColors();
    }
  }, [chartData])

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex]
      },
      offsetX: 0,
    },
    stroke: {
      width: 0.1,
      colors: ['#fff']
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        },
      }
    },
    colors: [
      "hsl(169, 43%, 58%)",
      "hsl(169, 36%, 66%)",
      "hsl(169, 29%, 74%)",
      "hsl(169, 22%, 82%)",
      "hsl(169, 15%, 90%)",
      "hsl(169, 8%, 98%)",
      "hsl(169, 1%, 106%)"
    ],
    xaxis: {
      categories: chartData && chartData.description,
      labels: {
        trim: true
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    }
  }

  const series = [
    {
      data: chartData && chartData.value
    }
  ];

  const getChartData = data => {
    const chartData = {
      value: [],
      description: []
    }

    data.forEach(item => {
      if (item.value > 0) {
        chartData.value.push(item.value);
        chartData.description.push(item.description);
      }
    });

    setChartData(chartData);
  }

  useEffect(() => {
    if (props.data) {
      setData(props.data);
      getChartData(props.data);
    }
  }, [props.data]);
  

  console.log(chartData)

  return (
    <React.Fragment>
      { chartData &&
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      }
    </React.Fragment>
  )
}

export default NumberOfItems;

import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";

const NumberOfItems = (props) => {
  const [chartData, setChartData] = useState(null);
  const [barColors, setColors] = useState([
    "hsl(169, 43%, 58%)",
    "hsl(169, 36%, 66%)",
    "hsl(169, 29%, 74%)",
    "hsl(169, 22%, 82%)",
    "hsl(169, 15%, 90%)",
    "hsl(169, 10%, 94%)",
    "hsl(169, 9%, 96%)",
    "hsl(169, 6%, 100%)"
  ]);

  const getColors = () => {
    let color = [];
    let saturation = 0;
    let lightness = 0;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps 
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
        colors: ['#fff'],
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'normal'
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
    colors: barColors,
    xaxis: {
      categories: chartData && chartData.description,
      labels: {
        trim: false,
        show: false,
      },
      floating: false,
      minHeight: undefined,
      maxHeight: 120,
      axisTicks: {
        show: false
      },
    },
    yaxis: {
      show: false,
      labels: {
        show: false
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="custom-tooltip">
                  ${w.globals.labels[dataPointIndex]} <br>
                  <span class='legend' style="background: ${w.globals.colors[dataPointIndex]}; color: ${w.globals.colors[dataPointIndex]}">|</span>
                  <b>${series[seriesIndex][dataPointIndex]}<b>
                </div>`
      },
      x: {
        show: false
      },
      marker: {
        show: false,
      },
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
      getChartData(props.data);
    }
  }, [props.data]);

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
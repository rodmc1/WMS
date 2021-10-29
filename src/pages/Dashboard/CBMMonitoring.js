import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import moment from 'moment';
import { ListItemSecondaryAction } from '@mui/material';

const CBMMonitoring = (props) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5
      },
    },
    xaxis: {
      type: 'datetime',
      categories: chartData && chartData.date[0],
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        }
      },
    },
    colors: ['#244945','#28514D','#2C5A56','#31645F','#366F6A','#3C7B75','#438982','#4B9891','#53A9A1','#5CBCB3'],
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const test = w.globals.seriesNames.map((item, index) => {
          
          return `<div class="received-label">${item}</div>
                  <span class='legend received'>|</span>
                  <b>${series[index][dataPointIndex]}</b>`
        })
        
        return `<div class="custom-tooltip received-tooltip">
                  <span class="tooltip-date">${moment(w.globals.lastXAxis.categories[dataPointIndex]).format('MMMM D, YYYY')}</span><br>
                  ${test.reverse()}
                </div>`
      }
    }
  }
  console.log(chartData)
  const series = [
    {
      name: 'PRODUCT A',
      data: [44, 55, 41, 67]
    },
    {
      name: 'PRODUCT B',
      data: [13, 23, 20, 8]
    },
    {
      name: 'PRODUCT C',
      data: [11, 17, 15, 15]
    },
    {
      name: 'PRODUCT D',
      data: [21, 7, 25, 13]
    },
  ];

  const getChartData = data => {
    // let chartDate = [];
    const chartData = {
      date: [],
      values: [],
      descriptions: [],
      series: []
    }

    const descriptions = [];
    const values = [];
    console.log(data)
    const chartDate = data.map(item => moment(item.date).format('MM/DD/YYYY') + ' GMT');
    chartData.date.push(chartDate);

    data.forEach(cbm => {
      cbm.items[0].forEach(item => {
        if (!chartData.descriptions.includes(item.description)) {
          chartData.descriptions.push(item.description);
        }
        chartData.values.push(item.value)
      }) 
    });

    // console.log(description)

    // chartDate.forEach(date => {
    //   let value = 0;
    //   let description;

    //   data.forEach(item => {
    //     if (date.includes(item.actual_arrived_datetime)) {
    //       value = item.value;
    //       description = item.description;
    //     }
    //   });

    //   chartData.value.push(value);
    //   chartData.description.push(description);
    // });

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

export default CBMMonitoring;
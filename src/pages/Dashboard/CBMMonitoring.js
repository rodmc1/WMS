import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

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
      categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT','01/05/2011 GMT', '01/06/2011 GMT'],
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    },
    colors: ['#244945','#28514D','#2C5A56','#31645F','#366F6A','#3C7B75','#438982','#4B9891','#53A9A1','#5CBCB3'],
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="custom-tooltip received-tooltip">
                  <span class="tooltip-date">${moment(w.globals.lastXAxis.categories[dataPointIndex]).format('MMMM D, YYYY')}</span> <br>
                  <div class="received-label">Received</div>
                  <span class='legend received'>|</span>
                  <b>${series[1][dataPointIndex]}</b>
                  <div class="received-label">Released</div>
                  <span class='legend released'>|</span>
                  <b>${series[0][dataPointIndex]}</b>
                </div>`
      }
    }
  }

  const series = [
    {
      data: [44, 55, 41, 67, 22, 43]
    },
    {
      data: [13, 23, 20, 8, 13, 27]
    },
    {
      data: [11, 17, 15, 15, 21, 14]
    },
    {
      data: [21, 7, 25, 13, 22, 8]
    },
  ];

  const getChartData = data => {
    let chartDate = [];
    const chartData = {
      date: [],
      value: [],
      description: [],
      series: []
    }

    data.forEach(item => {
      if (!chartDate.includes(item.actual_arrived_datetime)) {
        chartDate.push(item.actual_arrived_datetime);
        chartData.date.push(moment(item.actual_arrived_datetime).format('MM/DD/YYYY') + ' GMT');
      }
    });

    chartDate.forEach(date => {
      let value = 0;
      let description;

      data.forEach(item => {
        if (date.includes(item.actual_arrived_datetime)) {
          value = item.value;
          description = item.description;
        }
      });

      chartData.value.push(value);
      chartData.description.push(description);
    });

    setChartData(chartData);
  }

  console.log(chartData)

  useEffect(() => {
    if (props.data) {
      getChartData(props.data);
    }
  }, [props.data]);

  return (
    <React.Fragment>
      { 
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
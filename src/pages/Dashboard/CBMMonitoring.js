import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import moment from 'moment';
import { fetchMonitoring } from 'actions';
import { connect, useDispatch } from 'react-redux';

const CBMMonitoring = (props) => {
  const [data, setData] = useState('');
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
      categories: chartData && chartData.date,
    },
    fill: {
      opacity: 1
    },
    legend: {
      inverseOrder: true,
      offsetX: 0,
      offsetY: 15,
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 12,
        offsetX: -5,
        offsetY: 0
      },
      labels: {
        padding: 50
      },
      itemMargin: {
        horizontal: 15,
        vertical: 12
      },
    },
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
      name: 'Released',
      color: '#5EBCAB',
      data: chartData && chartData.released
    },
    {
      name: 'Received',
      color: '#C5EBE4',
      data: chartData && chartData.received
    },
  ];

  const getChartData = data => {
    const chartData = {
      date: [],
      received: [],
      released: []
    }
    let chartDate = [];

    data.forEach(item => {
      if (!chartDate.includes(item.datetime)) {
        chartDate.push(item.datetime);
        chartData.date.push(moment(item.datetime).format('MM/DD/YYYY') + ' GMT');
      }
    });

    chartDate.forEach(date => {
      let received = 0;
      let released = 0;

      data.forEach(item => {
        if (item.description === 'Inbound' && date.includes(item.datetime)) {
          received = item.value
        } 
  
        if (item.description === 'Outbound' && date.includes(item.datetime)) {
          released = item.value;
        }
      });

      chartData.received.push(received);
      chartData.released.push(released);
    });

    setChartData(chartData);
  }

  useEffect(() => {
    if (props.data) {
      setData(props.data);
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
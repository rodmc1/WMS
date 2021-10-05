import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";

const Radar = (props) => {
  const [data, setData] = useState('');
  const [controlled, setControlled] = useState(0);
  const [stockyard, setStockyard] = useState(0);
  const [refrigerated, setRefrigerated] = useState(0);
  const [heated, setHeated] = useState(0);
  const [dataSeries, setDataSeries] = useState([]);
  

  const options = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false
      },
      offsetY: -100,
      offsetX: -25
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#009688'],
    xaxis: {
      categories: ['Heated & Unheated General Warehouse', 'Refrigerated Warehouse','Controlled Humidity Warehouse','Stockyard'],
      labels: {
        style: {
          fontSize: "12px"
        },
        show: true
      }
    },
    plotOptions: {
      markers: {
        size: 3,
        hover: {
          size: 60
        },
        colors: ['#fff'],
        strokeColor: '#FF4560',
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="custom-tooltip">
                  ${w.globals.labels[dataPointIndex]} <br>
                  <span class='radar-legend'>|</span>
                  <b>${series[seriesIndex][dataPointIndex]}<b>
                </div>`
      }
    }
    
  }

  const series = [
    {
      data: data && dataSeries
    }
  ];

  useEffect(() => {
    if (props.data) {
      let controlled = 0;
      let heated = 0;
      let refrigerated = 0;
      let stockyard = 0;

      props.data.forEach((item) => {
        if (item.description === 'Controlled Humidity Warehouse') {
          controlled = item.value;
        }
        if (item.description === 'Heated & Unheated General Warehouse') {
          heated = item.value;
        }
        if (item.description === 'Refrigerated Warehouse') {
          refrigerated = item.value;
        }
        if (item.description === 'Stockyard') {
          stockyard = item.value;
        }
      });

      setHeated(heated);
      setControlled(controlled);
      setRefrigerated(refrigerated);
      setStockyard(stockyard);
      setData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (props.data) {
      setDataSeries([heated, controlled, refrigerated, stockyard]);
    }
  }, [controlled, heated]);


  return (
    <React.Fragment>
      {
        data &&
          <ReactApexChart
            options={options}
            series={series}
            type="radar"
            height="550"
          />
      }
    </React.Fragment>
  )
}

export default Radar;
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
        let tooltip = [];
        w.globals.seriesNames.forEach((item, index) => {
          if (series[index][dataPointIndex]) {
            tooltip.push(`<div class="received-label">${item}</div>
            <span class='legend received'>|</span>
            <b>${series[index][dataPointIndex]}</b>`)
          }
        })
        
        return `<div class="custom-tooltip received-tooltip">
                  <span class="tooltip-date">${moment(w.globals.lastXAxis.categories[dataPointIndex]).format('MMMM D, YYYY')}</span><br>
                  ${tooltip.reverse()}
                </div>`
      }
    }
  }


  const series = chartData && chartData.series;

  const getChartData = (data, type) => {
    const chartData = {
      date: [],
      values: [],
      descriptions: [],
      series: []
    }

    const date = data.map(item => moment(item.date).format('MM/DD/YYYY') + ' GMT');
    
    if (!date.length) {
      chartData.date.push([props.date.start, props.date.end]);
    } else {
      chartData.date.push(date);
    }

    data.forEach(cbm => {
      cbm.items[0].forEach(item => {
        if (!chartData.descriptions.includes(item.description)) {
          chartData.descriptions.push(item.description);
        }
        chartData.values.push(item.value)
      });
    });

    chartData.descriptions.forEach((desc, index) => {
      let seriesData = {
        name: desc,
        data: []
      }

      data.forEach((cbm, i) => {
        let val = 0
        cbm.items[0].forEach(item => {
          if (desc === item.description) {
            val = item.value;
          }
        });

        if (type === 'accumulate') {
          if (seriesData.data[seriesData.data.length - 1]) {
            seriesData.data.push(val + seriesData.data[seriesData.data.length - 1]);
          } else {
            seriesData.data.push(val);
          }
        }

        if (type === 'difference') {
          seriesData.data.push(val);
        }
      });
      
      chartData.series.push(seriesData)
    });

    setChartData(chartData);
  }
  
  useEffect(() => {
    if (props.data) {
      getChartData(props.data, props.type);
    }
  }, [props.data, props.type]);

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
import { useEffect, useRef} from "react";
import * as echarts from 'echarts';

function Chart({ currentDates, weights, walkingWeights, busWeights, lightgWeights}) {
  const chartRef = useRef(null);
  let chartInstance = null;
  useEffect(() => {
    // use to fix chart instance already initialized on the dom.
    echarts.dispose(chartRef.current);
    if(chartInstance == null){
      chartInstance = echarts.init(chartRef.current);
    }
    const option = {
      legend: {
        data: [
          "total weights",
          "walking",
          "bus",
          "light"
        ],
      },
      xAxis: {
        type: "category",
        data: currentDates,
      },
      yAxis: [
        { type: "value" },
        {
          type: "value",
          name: "g",
          nameTextStyle: {
            color: "#ccc",
            padding: [0, 0, 10, -30],
          },
          splitNumber: 5,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              width: 1,
              color: ["#ccc", "#ccc"],
            },
          },
          axisLabel: {
            show: true,
            axisName: {
              fontSize: 12,
            },
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        axisName: {
          color: "#fff",
          align: "left",
          fontSize: 14,
        },
        backgroundColor: "rgba(0,0,0,0.8)",
      },
      series: [
        {
          name: "total weights",
          data: weights,
          yAxisIndex: 1,
          type: "line",
          smooth: true,
        },
        {
          name: "walking",
          data: walkingWeights,
          type: "bar"
        },
        {
          name: "bus",
          data: busWeights,
          type: "bar"
        },
        {
          name: "light",
          data: lightgWeights,
          type: "bar"
        }
      ],
    };
    option && chartInstance.setOption(option);
  }, [currentDates, weights, walkingWeights, busWeights, lightgWeights]);
  
    return (
      <div>
        <div style={{ height: "400px" }} ref={chartRef} />
      </div>
    );
  }
  
  export default Chart;
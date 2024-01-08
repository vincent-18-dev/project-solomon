import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { Select } from "antd";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { PieChart } from "@mui/x-charts/PieChart";
export default function BarsDataset({ barValue }) {
  const chartSetting = {
    yAxis: [
      {
        label: "Sales Report on stack",
      },
    ],
    width: 1000,
    height: 400,
    sx: {
      [`.${axisClasses?.left} .${axisClasses?.label}`]: {
        transform: "translate(-80px, 0)",
        fill: "#02b2af",
        fontWeight: "700",
        textTransform: "uppercase",
      },
    },
  };

  const datasets = barValue?.data?.status_result?.data?.map((value) => {
    // console.log("value_params", value);
    const billDate = new Date(value?.Bill_Date);
    const formattedDate = billDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return {
      billAmt: value.Bill_Net_Amt,
      Date: formattedDate,
    };
  });

  const LinesDataForPieChart = barValue?.data?.status_result?.data?.map(
    (value, index) => {
      const billDate = new Date(value?.Bill_Date);
      const formattedDate = billDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const Data = value?.Bill_Net_Amt ?? 0;
      return { id: index, value: Data, label: formattedDate };
    }
  );

  const PieCharts = barValue?.data?.status_result?.data?.map((value, index) => {
    const billDate = new Date(value?.Bill_Date);
    const formattedDate = billDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const Data = value?.Bill_Net_Amt ?? 0;
    return { id: index, value: Data, label: formattedDate };
  });
  const valueFormatter = (value) => value;
  const [selectedChartType, setSelectedChartType] = React.useState("Bars");

  const handleChange = (value) => {
    setSelectedChartType(value);
  };
  const renderChart = () => {
    if (selectedChartType === "Bars") {
      return (
        <BarChart
          dataset={datasets}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "Date",
            },
          ]}
          series={[
            { dataKey: "billAmt", label: "Bill Amount", valueFormatter },
          ]}
          {...chartSetting}
        />
      );
    } else if (selectedChartType === "Lines") {
      return (
        <ScatterChart
          width={1000}
          height={500}
          series={[
            {
              label: "BILL AMOUNT",
              data: LinesDataForPieChart.map((item) => ({
                x: item.value,
                y: item.value, // Use the same property for x and y for simplicity
                id: item.id,
              })),
            },
          ]}
        />
      );
    } else if (selectedChartType === "pie") {
      return (
        <PieChart
          series={[
            {
              data: PieCharts.map((item) => ({
                id: item.id,
                value: item.value,
                label: item.label,
              })),
              // [{ id: 0, value: 10, label: "series A" }],
            },
          ]}
          width={1000}
          height={500}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Select
        optionFilterProp="children"
        onChange={handleChange}
        value={selectedChartType}
        options={[
          {
            value: "Bars",
            label: "Bars",
          },
          {
            value: "Lines",
            label: "Lines",
          },
          {
            value: "pie",
            label: "Pie",
          },
        ]}
      />
      {renderChart()}
    </>
  );
}

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

export default function BarsDataset({ barValue }) {
  let barData = barValue?.data?.status_result?.data;
  console.log("barValue", barData);
  const chartSetting = {
    // yAxis: [
    //   {
    //     label: "rainfall (mm)",
    //   },
    // ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  const datasets = barValue?.data?.status_result?.data.map((value) => {
    const billDate = new Date(value.Bill_Date);
    return {
      billAmt: value.Bill_Net_Amt,
      month: billDate.toLocaleString("en-us", { month: "short" }),
    };
  });
  const valueFormatter = (value) => `${value}`;
  return (
    <BarChart
      dataset={datasets}
      xAxis={[{ scaleType: "band", dataKey: "month", paddingInner: 0.2, 
      paddingOuter: 0.1 }]}
      series={[
        { dataKey: "billAmt", label: "Bill Amount", valueFormatter },
        // { dataKey: "month", label: "Month" },
      ]}
      {...chartSetting}
    />
  );
}

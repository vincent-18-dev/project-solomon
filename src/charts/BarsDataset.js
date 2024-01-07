import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

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
  console.log("datasets", datasets);
  const valueFormatter = (value) => value;
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
        // { dataKey: "month", label: "month", valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}

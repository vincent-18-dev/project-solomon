import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { Select } from "antd";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BarsDataset({ barValue }) {
  // console.log("barValue_vincent", barValue?.data?.status_result?.data);
  const [selectedChartType, setSelectedChartType] = React.useState("Bars");
  if (
    !barValue ||
    !barValue.data ||
    !barValue.data.status_result ||
    !barValue.data.status_result.header ||
    !barValue.data.status_result.data
  ) {
    return (
      <div>
        <p>Error: Invalid data structure</p>
      </div>
    );
  }

  if (!barValue.data.status_result.header.ischart) {
    return (
      <>
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <img src="/images/N-Data.jpg"></img>
        </div>
      </>
    );
  }

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

  const datasets =
    barValue?.data?.status_result?.data?.map((value) => {
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
    }) || [];

  const LinesDataForPieChart =
    barValue?.data?.status_result?.data?.map((value, index) => {
      const billDate = new Date(value?.Bill_Date);
      const formattedDate = billDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const Data = value?.Bill_Net_Amt ?? 0;
      return { id: index, value: Data, label: formattedDate };
    }) || [];

  const PieCharts = barValue.data.status_result.data
    ? barValue.data.status_result.data.map((value, index) => {
        const billDate = new Date(value?.Bill_Date);
        const formattedDate = billDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const Data = value?.Bill_Net_Amt ?? 0;
        return { id: index, value: Data, label: formattedDate };
      })
    : [];

  const valueFormatter = (value) => value;

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
                y: item.value,
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
        style={{ width: "100px" }}
        options={[
          {
            value: "Bars",
            label: "Bars",
            style: { fontSize: "15px" },
          },
          {
            value: "Lines",
            label: "Lines",
            style: { fontSize: "15px" },
          },
          {
            value: "pie",
            label: "Pie",
            style: { fontSize: "15px" },
          },
        ]}
      />
      {renderChart()}
    </>
  );
}

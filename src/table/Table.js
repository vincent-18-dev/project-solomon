import React from "react";
import { Table } from "antd";
const TableFunction = ({ tableData }) => {
  console.log("table_value", tableData);
  if (
    !tableData ||
    !tableData.data ||
    !tableData.data.status_result ||
    !tableData.data.status_result.header ||
    !tableData.data.status_result.data
  ) {
    return (
      <div>
        <p>Error: Invalid data structure</p>
      </div>
    );
  }
  const { header, data } = tableData.data.status_result;
  if (!Array.isArray(header) || !Array.isArray(data)) {
    return (
      <div>
        <p>Error: Invalid data format</p>
      </div>
    );
  }

  const columns = header.map((item) => ({
    title: item.caption,
    dataIndex: item.name,
    // fixed: true,
    width: 150,
    
  }));
  console.log("columns", columns);
  const dataSource = data.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{
          x: "150%",
          y: 300,
        }}
      />
    </>
  );
};

export default TableFunction;

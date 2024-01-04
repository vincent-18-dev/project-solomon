import React, { useState } from "react";
import { Table, Button } from "antd";

const TableFunction = ({ tableData }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

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

  const dataSource = data.map((item, index) => ({
    key: index,
    ...item,
  }));

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{
          x: "150%",
          y: 800,
        }}
        onChange={handleChange}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />
    </>
  );
};

export default TableFunction;

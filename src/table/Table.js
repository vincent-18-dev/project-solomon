import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const TableFunction = ({ tableData }) => {
  const [searchText, setSearchText] = useState("");
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
    width: 150,
    sorter: (a, b) => (
      console.log("value", a[item.name]),
      typeof a[item.name] === "number" && typeof b[item.name] === "number"
        ? a[item.name] - b[item.name]
        : String(a[item.name]).localeCompare(String(b[item.name]))
    ),
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${item.caption}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    onFilter: (value, record) => {
      return String(record[item.name])
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  }));
  // console.log("columns", columns)
  const filteredData = data.filter((item) => {
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    );
  });
  const dataSource = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));
  return (
    <>
      <div style={{ textAlign: "end" }}>
        <Input
          placeholder="Search overall"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginBottom: 16 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{
          x: "150%",
          y: 800,
        }}
      />
    </>
  );
};

export default TableFunction;

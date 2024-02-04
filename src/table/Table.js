import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const TableFunction = ({ tableData }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });
  // };

  useEffect(() => {
    if (
      tableData &&
      tableData.data &&
      tableData.data.status_result &&
      tableData.data.status_result.data
    ) {
      const filtered = tableData.data.status_result.data
        .filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchText.toLowerCase())
          )
        )
        // .map((item) => {
        //   return {
        //     ...item,
        //     ...(item.Bill_Date && {
        //       Bill_Date: formatDate(item.Bill_Date),
        //     }),
        //   };
        // });
      setFilteredData(filtered);
    }
  }, [tableData, searchText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset current page to 1 when searching
  };

  const columns = tableData.data.status_result.header.map((item) => ({
    title: item.caption,
    dataIndex: item.name,
    width: 150,
    onFilter: (value, record) => {
      return String(record[item.name])
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    sorter: (a, b) => {
      const valueA = a[item.name];
      const valueB = b[item.name];
      return typeof valueA === "number" && typeof valueB === "number"
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));
    },
  }));

  return (
    <>
      <div style={{ textAlign: "end" }}>
        <Input
          placeholder="Search overall"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200, marginBottom: 16 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{
          x: "150%",
          y: 800,
        }}
      />
    </>
  );
};

export default TableFunction;

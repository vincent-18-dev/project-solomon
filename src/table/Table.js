import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const TableFunction = ({ tableData }) => {
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    if (
      tableData &&
      tableData.data &&
      tableData.data.status_result &&
      tableData.data.status_result.data
    ) {
      const formattedData = tableData.data.status_result.data.map((item) => {
        Object.keys(item).forEach((key) => {
          let value = item[key];
          if (
            typeof value === "string" &&
            value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
          ) {
            value = new Date(value).toLocaleDateString("en-GB");
          } else if (value instanceof Date) {
            value = value.toLocaleDateString("en-GB");
          }
          item[key] = value;
        });
        return item;
      });

      const filtered = formattedData.filter(
        (item) =>
          Object.entries(columnFilters).every(([key, filterValue]) =>
            String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
          ) &&
          Object.values(item).some(
            (val) =>
              val !== undefined &&
              String(val).toLowerCase().includes(searchText.toLowerCase())
          )
      );
      setFilteredData(filtered);
    }
  }, [tableData, searchText, columnFilters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchText(searchInput);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchInput("");
    setCurrentPage(1);
    setFilteredData(tableData.data.status_result.data);
  };

  const handleColumnSearch = (selectedKeys, confirm, dataIndex) => {
    const filterValue = selectedKeys[0] || ""; // Set to empty string if undefined
    setColumnFilters((prevFilters) => ({
      ...prevFilters,
      [dataIndex]: filterValue,
    }));
    confirm();
  };

  const handleColumnReset = (clearFilters, dataIndex) => {
    clearFilters();
    setColumnFilters((prevFilters) => {
      const { [dataIndex]: removedFilter, ...restFilters } = prevFilters;
      return restFilters;
    });
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
          onPressEnter={() =>
            handleColumnSearch(selectedKeys, confirm, item.name)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleColumnSearch(selectedKeys, confirm, item.name)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleColumnReset(clearFilters, item.name)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          const inputElement = document.getElementById(
            `${item.name}-search-input`
          );
          if (inputElement) {
            inputElement.focus();
          }
        }, 0);
      }
    },
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
      <div style={{ textAlign: "end", marginBottom: 16 }}>
        <Input
          placeholder="Search overall"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          onClick={() => {
            handleSearch();
            setCurrentPage(1);
          }}
          style={{ marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={handleResetSearch}>Reset</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
          showSizeChanger: false,
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

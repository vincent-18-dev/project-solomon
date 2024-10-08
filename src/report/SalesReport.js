import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Layout, Menu, Switch } from "antd";
import { useForm } from "react-hook-form";
import * as HttpServices from "../service/Service";
import "../dashboard/Dashboard.css";
import {
  LogoutOutlined,
  AppstoreOutlined,
  CrownOutlined,
  FilterFilled,
} from "@ant-design/icons";
import { Spin } from "antd";
import TableFunction from "../table/Table";
import BarsDataset from "../charts/BarsDataset";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const SalesReport = () => {
  const { register, handleSubmit } = useForm();
  let getInput = localStorage.getItem("filter-input");
  let inputValue = JSON.parse(getInput) || [];
  const [fDate, setFDate] = useState(inputValue?.data?.fromdate);
  const [toDate, setToDate] = useState(inputValue?.data?.todate);
  const [menuId, setMenuID] = useState(inputValue?.data?.menuid);
  const [isChecked, setChecked] = useState(false);
  const [tableValue, setTableValue] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [currentChildName, setCurrentChildName] = useState("");
  const currentChildNameRef = useRef(currentChildName);
  let sideBar = localStorage.getItem("side-bar");
  const report = JSON.parse(sideBar) || [];

  const onSubmit = async () => {
    setLoading(true);
    currentChildNameRef.current = currentChildName;
    await TableFun(currentChildNameRef.current, true);
    setLoading(false);
  };

  const handleInputChangeFrom = (e) => {
    setFDate(e.target.value);
    setLoading(true);
  };

  const handleInputChangeTo = (e) => {
    setToDate(e.target.value);
    setLoading(true);
  };

  const TableFun = async (childName, isVerifyClick) => {
    if (!childName) {
      return;
    }
    setLoading(true);
    let repstatusValue = "";
    if (isVerifyClick) {
      repstatusValue = "refresh";
    }
    const menuNames = {
      method: "report",
      data: {
        repname: "soloserve",
        repstatus: repstatusValue,
        menuid: menuId,
        menuname: childName,
        fromdate: fDate,
        todate: toDate,
      },
    };
    try {
      let menuName = await HttpServices.Table(menuNames);
      console.log("menuName", menuName);
      setTableValue(menuName);
    } catch (error) {
      console.log({ err: error });
      setTableValue({
        status: 500,
        data: { status_result: { header: { ischart: false } } },
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (checked) => {
    setChecked(checked);
    setLoading(true);
    setLoading(false);
  };

  const navigate = useNavigate();
  const LogoutFun = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible>
        <div className="logo" />
        <div className="dashboard-name"></div>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          {report.data.map((value, parentIndex) => (
            <SubMenu
              key={`submenu-${parentIndex}`}
              title={value.text}
              icon={<AppstoreOutlined />}
            >
              {value.child.map((child, childIndex) => (
                <Menu.Item
                  key={`menu-item-${parentIndex}-${childIndex}`}
                  onClick={() => {
                    setCurrentChildName(child.name);
                    TableFun(child.name);
                  }}
                  icon={<CrownOutlined />}
                >
                  {child.text}
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row align="middle">
            <Col span={18}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <a href="/" style={{ display: "flex" }}>
                  <img
                    className="bpal_logo"
                    src="/images/Bpal.png"
                    alt="Logo"
                  />
                </a>
              </div>
            </Col>
            <Col span={4}>
              <div>
                <a href="/Dashboard" style={{ color: "#ff5500" }}>
                  Dashboard
                </a>{" "}
                <span style={{ color: "white" }}>/ SalesReport</span>
              </div>
            </Col>
            <Col span={2}>
              <LogoutOutlined
                style={{ fontSize: "25px", color: "#FFF", cursor: "pointer" }}
                color="#FFF"
                onClick={LogoutFun}
              />
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <div className="date-filter-section">
              <form
                className="filter-date-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="date-input-section">
                  <label>From</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={inputValue?.data?.fromdate}
                    {...register("fromdate")}
                    onChange={handleInputChangeFrom}
                  ></input>
                </div>
                <div className="date-input-section">
                  <label>To</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={inputValue?.data?.todate}
                    {...register("todate")}
                    onChange={handleInputChangeTo}
                  ></input>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button>
                    Refresh{" "}
                    <FilterFilled
                      style={{ fontSize: "16px", paddingLeft: "5px" }}
                    />
                  </button>
                </div>
              </form>
            </div>
            <div style={{ marginTop: "100px" }}>
              {isLoading ? (
                <div style={{ textAlign: "center" }}>
                  <Spin tip="Loading..." />
                </div>
              ) : tableValue.status === 200 &&
                tableValue.data &&
                tableValue.data.status_result !== "" &&
                tableValue?.data?.status_result?.data?.length !== 0 ? (
                <>
                  <div className="toggle-btn">
                    <span>Table</span>{" "}
                    <Switch
                      defaultChecked={isChecked}
                      onChange={onChange}
                      style={{
                        background: isChecked ? "#345a7c" : "#bfbfbf",
                      }}
                    />{" "}
                    <span>Chart</span>
                  </div>
                  {isChecked ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <BarsDataset barValue={tableValue} />
                    </div>
                  ) : (
                    <>
                      <TableFunction tableData={tableValue} />
                    </>
                  )}
                </>
              ) : tableValue.status === 400 ||
                (tableValue.status === 200 &&
                  tableValue.data &&
                  tableValue.data.status_result === "") ||
                tableValue?.data?.status_result?.data?.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <img src="/images/N-Data.jpg" alt="No Data" />
                </div>
              ) : null}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SalesReport;

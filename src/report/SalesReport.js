import React, { useState, useEffect } from "react";
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

const SalesReport = ({}) => {
  const { register, handleSubmit } = useForm();
  let getInput = localStorage.getItem("filter-input");
  let inputValue = JSON.parse(getInput) || [];
  const [fDate, SetfDate] = useState(inputValue?.data?.fromdate);
  const [toDate, SettoDate] = useState(inputValue?.data?.todate);
  const [menuId, setMenuID] = useState(inputValue?.data?.menuid);
  const [isChecked, setChecked] = useState(false);
  const [tableValue, setTableValue] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("getInput", inputValue);
  let sideBar = localStorage.getItem("side-bar");
  console.log("side-bar", localStorage.getItem("side-bar"));
  const report = JSON.parse(sideBar) || [];
  const onSubmit = async (data) => {
    SetfDate(data.fromdate);
    SettoDate(data.todate);
    setIsTyping(false);
    TableFun();
  };

  const handleInputChange = () => {
    setIsTyping(true);
  };
  const TableFun = async (childName) => {
    if (!childName) {
      return;
    }
    const menuNames = {
      method: "report",
      data: {
        repname: "soloserve",
        repstatus: "",
        menuid: menuId,
        menuname: childName,
        fromdate: fDate,
        todate: toDate,
      },
    };
    try {
      setLoading(true);
      let menuName = await HttpServices.Table(menuNames);
      setTableValue(menuName);
      setLoading(false);
    } catch (error) {
      console.log({ error });
    }
    setError(true);
  };
  const onChange = (checked) => {
    setChecked(checked);
  };
  const navigate = useNavigate();
  const LogoutFun = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  console.log("tableValue", tableValue);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible>
          <div className="logo" />
          <div className="dashboard-name">
            {/* {collapsed ? 'Dashboard' : 'Your Full Dashboard Name'} */}
            {/* <img className="bpal_logo" src="/images/Bpal.png" alt="Logo" /> */}
          </div>
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
          {/* </>
          )} */}
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Row align="middle">
              <Col span={18}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="bpal_logo"
                    src="/images/Bpal.png"
                    alt="Logo"
                  />
                </div>
              </Col>
              <Col span={4}>
                <div>
                  <a href="/Dashboard">Dashboard</a>{" "}
                  <span style={{ color: "white" }}>/ SalesReport</span>
                </div>
              </Col>
              <Col span={2}>
                <LogoutOutlined
                  style={{ fontSize: "25px", color: "#FFF", cursor: "pointer" }}
                  color="#FFF"
                  onClick={LogoutFun}
                />
                {/* <span>LOGOUT</span> */}
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: "16px" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <>
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
                        {...register("fromdate", { required: true })}
                        onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="date-input-section">
                      <label>To</label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={inputValue?.data?.todate}
                        {...register("todate", { required: true })}
                        onChange={handleInputChange}
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
              </>
              <div style={{ marginTop: "100px" }}>
                {isTyping  ? (
                  <>
                    <div>
                      <Spin  fullscreen={true}/>
                    </div>
                  </>
                ) : tableValue.status === 200 &&
                  tableValue.data.status_result !== "" ? (
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
                      <>
                        <div style={{ display: "flex" }}>
                          <BarsDataset barValue={tableValue} />
                        </div>
                      </>
                    ) : (
                      <TableFunction tableData={tableValue} />
                    )}
                  </>
                ) : (
                  error && (
                    <>
                      <div style={{ textAlign: "center" }}>
                        <img src="/images/N-Data.jpg"></img>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default SalesReport;

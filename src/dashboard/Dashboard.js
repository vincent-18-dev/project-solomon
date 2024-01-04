import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Layout, Menu, Switch } from "antd";
import { useForm } from "react-hook-form";
import * as HttpServices from "../service/Service";
import "./Dashboard.css";
import {
  LogoutOutlined,
  CodepenOutlined,
  AppstoreOutlined,
  CrownOutlined,
  FilterFilled,
} from "@ant-design/icons";
// import SalesReport from "../report/SalesReport";
import TableFunction from "../table/Table";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const navigate = useNavigate();
  const storedData = localStorage.getItem("data");
  const getData = JSON.parse(storedData) || [];
  const [menuData, setMenuData] = useState([]);
  const [menuid, setMenuid] = useState("");
  const [report, setReport] = useState([]);
  // const [menunames, setMenunames] = useState("");
  const [input, setInput] = useState("");
  const [tabledata, setTabledata] = useState([]);
  const { register, handleSubmit } = useForm();
  const [isChecked, setChecked] = useState(false);
  const LogoutFun = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  const menuFilter = () => {
    const initialMenu = getData.reduce((acc, item) => {
      if (item.Menu_Parent_Level === 0) {
        acc.push({ ...item, submenus: [] });
      } else {
        acc.forEach((value) => {
          if (value.Menu_Id === item.Menu_Parent_Id) {
            value.submenus.push({ ...item, nestedSubmenus: [] });
          } else {
            value.submenus.forEach((nested) => {
              if (nested.Menu_Id === item.Menu_Parent_Id) {
                nested.nestedSubmenus.push({ ...item });
              }
            });
          }
        });
      }
      return acc;
    }, []);
    setMenuData(initialMenu);
  };

  const onSubmit = async (data) => {
    setInput(data);
    try {
      const filter = {
        method: "report",
        data: {
          repname: "soloserve",
          repstatus: "refresh",
          menuid: menuid,
          menuname: "",
          ...data,
        },
      };
      localStorage.setItem("filter-input", JSON.stringify(filter));
      let filterInfo = await HttpServices.search(filter);
      if (filterInfo.status === 200 && filterInfo?.data?.status_result !== "") {
        localStorage.setItem(
          "side-bar",
          JSON.stringify(filterInfo?.data?.status_result)
        );
        setReport(filterInfo?.data?.status_result);
        navigate("/SalesReport");
      }
    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  const TableFun = async (childName) => {
    try {
      const menuNames = {
        method: "report",
        data: {
          repname: "soloserve",
          repstatus: "refresh",
          menuid: menuid,
          menuname: childName,
          ...input,
        },
      };
      let menuName = await HttpServices.Table(menuNames);
      setTabledata(menuName);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };
  // const onChange = (checked) => {
  //   setChecked(checked);
  // };
  useEffect(() => {
    menuFilter();
  }, []);
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
          {/* {report?.data?.length > 0 ? (
            <>
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
                          // setMenunames(child.name);
                        }}
                        icon={<CrownOutlined />}
                      >
                        {child.text}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ))}
              </Menu>
            </>
          ) : (
            <> */}
          <Menu theme="dark" mode="inline">
            {menuData.map((menuItem, index) => (
              <SubMenu
                key={`submenu-${index + 1}`}
                title={menuItem.Menu_Caption}
                icon={<AppstoreOutlined />}
              >
                {menuItem.submenus.map((subItem, subIndex) => (
                  <React.Fragment
                    key={`submenu-item-${index + 1}-${subIndex + 1}`}
                  >
                    <Menu.Item
                      key={`submenu-item-${index + 1}-${subIndex + 1}`}
                      onClick={() => setMenuid(subItem.Menu_Id)}
                      icon={<CrownOutlined />}
                    >
                      {subItem.Menu_Caption}
                    </Menu.Item>
                    {subItem.nestedSubmenus &&
                      subItem.nestedSubmenus.length > 0 && (
                        <SubMenu
                          key={`nested-submenu-${index + 1}`}
                          title={subItem.Menu_Caption}
                        >
                          {subItem.nestedSubmenus.map((nestedSubmenu) => (
                            <Menu.Item
                              style={{ paddingLeft: "48px" }}
                              key={nestedSubmenu.id}
                              icon={<CodepenOutlined />}
                              onClick={() => setMenuid(nestedSubmenu.Menu_Id)}
                            >
                              {nestedSubmenu.Menu_Caption}
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      )}
                  </React.Fragment>
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
              <Col span={22}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="bpal_logo"
                    src="/images/Bpal.png"
                    alt="Logo"
                  />
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
              {menuid ? (
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
                          {...register("fromdate", { required: true })}
                        ></input>
                      </div>
                      <div className="date-input-section">
                        <label>To</label>
                        <input
                          type="date"
                          name="date"
                          {...register("todate", { required: true })}
                        ></input>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
              ) : (
                <img src="/images/grocery.jpg" className="dashboard-image" />
              )}
              <div style={{ marginTop: "100px" }}>
                {/* {tabledata.status === 200 && (
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
                    <TableFunction tableData={tabledata} />
                  </>
                )} */}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;

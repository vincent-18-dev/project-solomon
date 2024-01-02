import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Layout, Menu } from "antd";
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
import SalesReport from "../report/SalesReport";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const storedData = localStorage.getItem("data");
  const getData = JSON.parse(storedData) || [];
  const [menuData, setMenuData] = useState([]);
  const [menuid, setMenuid] = useState("");
  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const LogoutFun = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  useEffect(() => {
    menuFilter();
  }, []);

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

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
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
      let filterInfo = await HttpServices.search(filter);
      if (filterInfo.status === 200 && filterInfo?.data?.status_result !== "") {
        setReport(filterInfo?.data?.status_result);
        console.log("filterInfo", filterInfo);
        const report_data = report?.data.map((value) => {
          if(value)
          console.log("value", value);
        });
      }
    } catch (errors) {
      console.log({ errors });
    }
    // reset();
  };

  // console.log(report, "menuid");
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
          {report?.data?.length > 0 ? (
            <>
              <p>hello</p>
            </>
          ) : (
            <>
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
                                  onClick={() =>
                                    setMenuid(nestedSubmenu.Menu_Id)
                                  }
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
            </>
          )}
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
                          Filter{" "}
                          <FilterFilled
                            style={{ fontSize: "16px", paddingLeft: "5px" }}
                          />
                        </button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <SalesReport />
                  </div>
                </>
              ) : (
                <img src="/images/grocery.jpg" className="dashboard-image" />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;

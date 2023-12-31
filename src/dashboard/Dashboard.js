import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Drawer, Menu as AntMenu } from "antd";
import { CSSTransition } from "react-transition-group";
import {
  CodepenOutlined,
  CrownOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";

const Dashboard = () => {
  const storedData = localStorage.getItem("data");
  const getData = JSON.parse(storedData) || [];
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(true);
  const [size, setSize] = useState("default");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const showDefaultDrawer = () => {
    setSize("default");
    setOpen(true);
  };

  const onClose = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

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

  const drawerTitle = (
    <div>
      <img
        src="/images/trolley.png"
        alt="Your Image Alt Text"
        style={{ width: 50, height: 50, marginRight: 16 }}
      />
    </div>
  );

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-section">
          <div>
            <Button onClick={LogoutFun}>Log out</Button>
          </div>
          <Drawer
            title={drawerTitle}
            placement="left"
            onClose={onClose}
            open={open}
          >
            <CSSTransition
              in={open}
              timeout={300}
              classNames="menu"
              unmountOnExit
            >
              <AntMenu mode="inline" theme="dark">
                {menuData.map((value) => (
                  <AntMenu.SubMenu
                    style={{ fontSize: "18px" }}
                    key={value.Menu_Caption}
                    title={value.Menu_Caption}
                    icon={<AppstoreOutlined />}
                  >
                    {value.submenus.map((subItem) => (
                      <React.Fragment key={subItem.id}>
                        <AntMenu.Item
                          style={{ paddingLeft: "40px" }}
                          key={subItem.id}
                          icon={<CrownOutlined />}
                          onClick={() => navigate(subItem.YourPageRoute)}
                        >
                          {subItem.Menu_Caption}
                        </AntMenu.Item>
                        {subItem.nestedSubmenus &&
                          subItem.nestedSubmenus.length > 0 && (
                            <React.Fragment key={subItem.id}>
                              <AntMenu.SubMenu
                                style={{ fontSize: "15px", paddingLeft: "0px" }}
                                title={subItem.Menu_Caption}
                                icon={<CodepenOutlined />}
                              >
                                {subItem.nestedSubmenus.map((nestedSubmenu) => (
                                  <AntMenu.Item
                                    style={{ paddingLeft: "48px" }}
                                    key={nestedSubmenu.id}
                                    icon={<CodepenOutlined />}
                                    onClick={() =>
                                      navigate(nestedSubmenu.YourPageRoute)
                                    }
                                  >
                                    {nestedSubmenu.Menu_Caption}
                                  </AntMenu.Item>
                                ))}
                              </AntMenu.SubMenu>
                            </React.Fragment>
                          )}
                      </React.Fragment>
                    ))}
                  </AntMenu.SubMenu>
                ))}
              </AntMenu>
            </CSSTransition>
          </Drawer>
          <Button
            type="primary"
            onClick={showDefaultDrawer}
            className="mobile-button"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

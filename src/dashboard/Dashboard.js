import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Drawer, Menu as AntMenu } from "antd";
import { CSSTransition } from "react-transition-group";
import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
// import "./YourCSSFile.css";

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
    setOpen(false);
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

  const handleSubMenuClick = () => {
    setCollapsed(!collapsed);
  };

  const renderNestedSubmenus = (nestedSubmenus) => {
    return nestedSubmenus.map((nestedSubmenu) => (
      <AntMenu.Item key={nestedSubmenu.id}>
        {nestedSubmenu.Menu_Caption}
      </AntMenu.Item>
    ));
  };

  return (
    <>
      <Drawer
        title={`${size} Drawer`}
        placement="left"
        size={size}
        visible={open}
        onClose={onClose}
        extra={
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </div>
        }
      >
        <CSSTransition in={open} timeout={300} classNames="menu" unmountOnExit>
          <AntMenu mode="inline" theme="dark" inlineCollapsed={collapsed}>
            {menuData.map((value) => (
              <AntMenu.SubMenu
                key={value.Menu_Caption}
                title={value.Menu_Caption}
                icon={<AppstoreOutlined />}
              >
                {value.submenus.map((subItem) => (
                  <React.Fragment key={subItem.id}>
                    <AntMenu.Item
                      key={subItem.id}
                      icon={<MailOutlined />}
                      onClick={handleSubMenuClick}
                    >
                      {subItem.Menu_Caption}
                    </AntMenu.Item>
                    {subItem.nestedSubmenus &&
                      subItem.nestedSubmenus.length > 0 && (
                        <AntMenu.SubMenu
                          key={`nested_${subItem.id}`}
                          title="Nested Submenus"
                          icon={<SettingOutlined />}
                        >
                          {renderNestedSubmenus(subItem.nestedSubmenus)}
                        </AntMenu.SubMenu>
                      )}
                  </React.Fragment>
                ))}
              </AntMenu.SubMenu>
            ))}
          </AntMenu>
        </CSSTransition>
      </Drawer>
      <div className="dashboard-section">
        <Button type="primary" onClick={showDefaultDrawer}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Button onClick={LogoutFun}>Log out</Button>
      </div>
    </>
  );
};

export default Dashboard;

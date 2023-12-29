import "./Dashboard.css";
import React, { useState } from "react";
// import { MdOutlineArrowDropDown } from "react-icons/md";
import Dropdown from "react-multilevel-dropdown";

const Dashboard = ({ data }) => {
  let values = data?.data.filter((item) => item?.Menu_Parent_Level === 0) || [];
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [submenu, setSubmenu] = useState("");
  const submenuClick = (val) => {
    let submenu = data?.data?.filter(
      (value) => val.Menu_Id === value.Menu_Parent_Id
    );
    setSubmenu(submenu);
    setClicked(false);
    console.log("submenu", submenu);
  };
  const secondMenu = (items) => {
    let nestedmenu = data?.data?.filter(
      (val) => items.Menu_Id === val.Menu_Parent_Id
    );
    setOpenSubMenu(nestedmenu);
    setClicked(true);
  };
  return (
    <>
      <div className="container-dashboard">
        <div className="section-home">
          <div className="menubar-section">
            {values.map((val) => {
              return (
                <Dropdown
                  position="right"
                  onClick={() => submenuClick(val)}
                  title={val?.Menu_Caption}
                >
                  {submenu.length > 0 &&
                    submenu?.map((items) => {
                      return (
                        <Dropdown.Item
                          onClick={() => secondMenu(items)}
                          position="bottom"
                        >
                          {items.Menu_Caption}
                          {clicked && openSubMenu?.length > 0 && (
                            <Dropdown.Submenu position="bottom">
                              {openSubMenu.map((sub) => (
                                <Dropdown.Item key={sub.Menu_Id}>
                                  {sub.Menu_Caption}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Submenu>
                          )}
                        </Dropdown.Item>
                      );
                    })}
                  {/* <Dropdown.Item>Item 2</Dropdown.Item> */}
                </Dropdown>
              );
            })}
          </div>
          <div className="dashboard-section"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

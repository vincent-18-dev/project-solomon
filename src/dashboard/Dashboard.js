import "./Dashboard.css";
import React, { useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
const Dashboard = ({ data }) => {
  // console.log("data", data);
  let values = data?.data.filter((item) => item?.Menu_Parent_Level === 0) || [];
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [submenu, setSubmenu] = useState("");
  const submenuClick = (val, index) => {
    let submenu = data?.data?.filter((value) => {
      if (val.Menu_Id === value.Menu_Parent_Level) {
        return value.Menu_Caption;
      }
    });
    setSubmenu(submenu);
    setOpenSubMenu((prevIndex) => (prevIndex === index ? null : index));
  };

  const secondMenu = (items, index) => {
    let nestedmenu = data?.data?.filter((val) => {
      if (items.Menu_Id === val.Menu_Parent_Level) {
        return val.Menu_Caption;
      }
    });
    console.log("nestedmenu",nestedmenu)
  };
  return (
    <>
      <div className="container-dashboard">
        <div className="section-home">
          <div className="menubar-section">
            <ul className="menu-ul">
              {values.map((val, index) => {
                return (
                  <>
                    <div
                      className="menu-data-li"
                      key={index}
                      onClick={() => submenuClick(val, index)}
                    >
                      <li>{val?.Menu_Caption}</li> <MdOutlineArrowDropDown />
                    </div>
                    {openSubMenu === index && (
                      <ul className="sub-menu">
                        {submenu?.map((items, index) => {
                          return (
                            <li
                              key={index}
                              onClick={() => secondMenu(items, index)}
                            >
                              {items.Menu_Caption}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                );
              })}
            </ul>
          </div>
          <div className="dashboard-section"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

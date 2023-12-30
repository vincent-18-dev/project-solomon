import React, { useState } from "react";
import Dropdown from "react-multilevel-dropdown";
import "./Dashboard.css";

const buttonStyle = {
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '12px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const SubMenu = ({ level, menuId, menuName }) => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleSubMenuClick = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div>
      <div
        style={{
          ...buttonStyle,
          backgroundColor: '#2196f3',
          padding: '8px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        onClick={handleSubMenuClick}
      >
        <span>{level === 1 ? 'Level 1:' : `Level 2: ${menuId}`}</span>
        <span>{showSubMenu ? '▼' : '▶'}</span>
      </div>
      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
        }}
      >
        {showSubMenu && level === 1 && (
          <SubMenu level={level + 1} menuId={menuId} menuName={menuName} />
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ data }) => {
  const values = data?.data?.filter((item) => item?.Menu_Parent_Level === 0) || [];
  let dataoption = (data?.data || []).map(item => ({
    Menu_Id: item.Menu_Id,
    Menu_Name: item.Menu_Name,
    Menu_Caption: item.Menu_Caption,
    Menu_Parent_Id: item.Menu_Parent_Id,
  }));

  const menuOptions = values.map(item => ({
    Menu_Id: item.Menu_Id,
    Menu_Name: item.Menu_Name,
    Menu_Caption: item.Menu_Caption,
  }));

  dataoption = dataoption.filter(dataItem => {
    return menuOptions.some(menuItem => menuItem.Menu_Id === dataItem.Menu_Parent_Id);
  });

  const result = dataoption.map(item => ({ Menu_Caption: item.Menu_Caption }));
  console.log(result, 'result');

  const [showSubMenu, setShowSubMenu] = useState({});

  const handleMenuClick = (menuId) => {
    setShowSubMenu((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <>
      <div style={{ width: '20%', marginTop: '50px' }}>
        {menuOptions.map((item) => (
          <div key={item.Menu_Id}>
            <div style={buttonStyle} onClick={() => handleMenuClick(item.Menu_Id)}>
              {item.Menu_Name}
            </div>
            {showSubMenu[item.Menu_Id] && (
              <SubMenu level={1} menuId={item.Menu_Id} menuName={item.Menu_Name} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;

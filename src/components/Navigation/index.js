import './style.scss';
import React from 'react';
import history from 'config/history';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { HomeWork, KeyboardArrowUp, ChevronLeft, ChevronRight, TableChart } from '@material-ui/icons';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SvgIcon from '@mui/material/SvgIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AllInboxIcon from '@mui/icons-material/AllInbox';

function InventoryIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20 2H4C3 2 2 2.9 2 4V7.01C2 7.73 2.43 8.35 3 8.7V20C3 21.1 4.1 22 5 22H19C19.9 22 21 21.1 21 20V8.7C21.57 8.35 22 7.73 22 7.01V4C22 2.9 21 2 20 2ZM15 14H9V12H15V14ZM20 7H4V4L20 3.98V7Z" fill="#323232"/>
    </SvgIcon>
  );
}

function Navigation(props) {
  const location = useLocation();
  const [navigation, setNavigation] = React.useState([
    {
      group: 'Warehouse Management',
      list: [
        {
          label:'Dashboard',
          path: '/',
          icon: DashboardIcon
        },
        {
          label:'Warehouse List',
          path: '/warehouse-list',
          icon: HomeWork
        },
        {
          label:'SKU Management',
          path: '/sku-management',
          icon: AllInboxIcon
        },
      ]
    },
    {
      group: 'Operation',
      list: [
        {
          label:'Warehouse Master Data',
          path: '/warehouse-master-data',
          icon: TableChart
        },
        {
          label:'Delivery Notice',
          path: '/delivery-notice',
          icon: EventNoteIcon
        },
        {
          label:'Receiving and Releasing',
          path: '/receiving-and-releasing',
          icon: InventoryIcon
        },
      ]
    },
    {
      group: 'Records',
      list: [
        {
          label:'Audit Log',
          path: '/audit-log',
          icon: AssignmentIcon
        },
      ]
    },
  ]);
  
  // Function for collapse sidebar
  const toggleNavigationGroup = (index) => {
    if (index === 0) return;
    const temp = [...navigation];
    temp[index].collapsed = !temp[index].collapsed;
    setNavigation(temp);
  }

  // Function for setting an active class
  const setActiveClass = i => {
    const sPath = location.pathname;
    const sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    let className = 'main-nav__group-list-item-link';
    const activeClassName = `${className} main-nav__group-list-item-link--active`;
    
    if (!sPage.length && i.path === '/') className = activeClassName;
    if (history.location.pathname.match(i.path) && i.path !== '/') className = activeClassName;

    return className;
  }

  const createNavigation = () => {
    return (
      <nav className="main-nav">
        {navigation.map((item, index) => {
          return (
            <div className={`main-nav__group ${item.collapsed ? "main-nav__group--collapsed" : ""}`} key={index} >
              { item.group &&
                <div className="main-nav__group-label" onClick={() => toggleNavigationGroup(index)}>
                  <p>{item.group} <KeyboardArrowUp /></p>
                  <span>{item.list.map((i, index) => {
                    const separator = index !== item.list.length - 1 ? ', ' : '';
                    return i.label + separator;
                  })}</span>
                </div>
              }
              <ul className="main-nav__group-list" style={{
                // Items Height + Group Label Height
                maxHeight: (item.list.length * 48 + 68)
              }}>
                {item.list.map(i => {
                  return (
                    <li key={i.label} className="main-nav__group-list-item">
                      { props.isNavigationCollapsed
                        ? <Tooltip title={i.label} placement="right" arrow>
                            <NavLink to={i.path} className={setActiveClass(i)}>{React.createElement(i.icon)}</NavLink>
                          </Tooltip>
                        : <NavLink to={i.path} className={setActiveClass(i)}>{React.createElement(i.icon)}<span>{i.label}</span></NavLink>
                      }
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    )
  }

  return (
    <React.Fragment>
      {createNavigation()}
      <div className="drawer__button" onClick={() => props.setIsNavigationCollapsed(!props.isNavigationCollapsed)}>
        {!props.isNavigationCollapsed && <><span>Minimize</span> <ChevronLeft /></>}
        {props.isNavigationCollapsed && <ChevronRight />}
      </div>
    </React.Fragment>
  )
};

export default Navigation;
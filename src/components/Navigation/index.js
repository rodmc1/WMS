import './style.scss';
import React from 'react';
import history from 'config/history';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import { HomeWork, KeyboardArrowUp, ChevronLeft, ChevronRight, TableChart } from '@material-ui/icons';

function Navigation(props) {
  const location = useLocation();
  const [navigation, setNavigation] = React.useState([
    {
      group: 'Warehouse Management',
      list: [
        {
          label:'Warehouse List',
          path: '/',
          icon: HomeWork
        },
      ]
    },
    {
      group: 'Warehouse Master Data',
      list: [
        {
          label:'SKU',
          path: '/warehouse-master-data',
          icon: LineWeightIcon
        },
        {
          label:'Delivery Notice',
          path: '/delivery-notice',
          icon: EventNoteIcon
        }
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
    if (history.location.pathname.match('warehouse-list') && i.path === '/') className = activeClassName;

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
                    // if (i.permission && !Common.getPermission(i.permission, i.page)) return;
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
                  // if (i.permission && !Common.getPermission(i.permission, i.page)) return;
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
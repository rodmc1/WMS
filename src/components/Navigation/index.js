import './style.scss';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { HomeWork, KeyboardArrowUp, ChevronLeft, ChevronRight, TableChart } from '@material-ui/icons';

function Navigation(props) {
  const [isHome, setIsHome] = React.useState(false);
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
        {
          label:'Warehouse Master Data',
          path: '/warehouse-master-data',
          icon: TableChart
        }
      ]
    },
  ]);
  
  const toggleNavigationGroup = (index) => {
    if (index === 0) return;
    const temp = [...navigation];
    temp[index].collapsed = !temp[index].collapsed;
    setNavigation(temp);
  }

  React.useEffect(() => {
    const pattern = new RegExp('warehouse-list');
    if (pattern.test(location.pathname)) {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
  }, [location]);

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
                      { 
                        props.isNavigationCollapsed ?
                        <Tooltip title={i.label} placement="right" arrow>
                          <NavLink to={i.path} exact={isHome} className="main-nav__group-list-item-link" activeClassName="main-nav__group-list-item-link--active">
                            {React.createElement(i.icon)}
                          </NavLink>
                        </Tooltip>
                        :
                        <NavLink to={i.path} exact={isHome} className="main-nav__group-list-item-link" activeClassName="main-nav__group-list-item-link--active">
                          {React.createElement(i.icon)} <span>{i.label}</span>
                        </NavLink>
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
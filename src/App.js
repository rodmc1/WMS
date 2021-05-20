import './App.scss';
import React from 'react';
import history from 'config/history';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

import { AuthenticationProvider } from 'context/Authentication';
import { SnackbarProvider } from 'context/Snackbar';
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import WarehouseList from 'pages/WarehouseList';
import WarehouseOverview from 'pages/WarehouseList/WarehouseOverview';
import WarehouseCreate from 'pages/WarehouseList/WarehouseCreate';
import WarehouseEdit from 'pages/WarehouseList/WarehouseEdit';
import StorageBins from 'pages/StorageBins';
import SKU from 'pages/SKU';
import Authentication from 'components/Authentication';

function App() {

  const [isNavigationCollapsed, setIsNavigationCollapsed] = React.useState(false);
  const drawerSpring = useSpring({
    width: isNavigationCollapsed ? 88 : 360
  });
  const mainSpring = useSpring({
    marginLeft: isNavigationCollapsed ? 88 : 360
  })

  return (
    <div className="App">
      <AuthenticationProvider>
        <SnackbarProvider>
          <Authentication />
          <Router history={history}>
            <Header/>
            <animated.div className={`drawer ${isNavigationCollapsed ? 'drawer--collapsed' : ''}`} style={drawerSpring}>
              <Navigation isNavigationCollapsed={isNavigationCollapsed} setIsNavigationCollapsed={setIsNavigationCollapsed} />
            </animated.div>
            <animated.main style={mainSpring}>
              <Switch>
                <Route exact path='/' component={WarehouseList} />
                <Route exact path='/warehouse-list/:id/overview/' component={WarehouseOverview} />
                <Route exact path='/warehouse-list/warehouse-create' component={WarehouseCreate} />
                <Route exact path='/warehouse-list/:id/warehouse-edit' component={WarehouseEdit} />
                <Route exact path='/storage-bins' component={StorageBins} />
                <Route exact path='/sku' component={SKU} />
                <Route>
                  <Redirect to='/' />
                </Route>
              </Switch>
            </animated.main>
          </Router>
        </SnackbarProvider>
      </AuthenticationProvider>
    </div>
  );
}

export default App;

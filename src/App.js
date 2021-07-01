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
import WarehouseMasterData from 'pages/WarehouseMasterData';
import WarehouseMasterDataOverview from 'pages/WarehouseMasterData/Overview';
import WarehouseMasterDataSKU from 'pages/WarehouseMasterData/SKU';
import WarehouseMasterDataSKUCreate from 'pages/WarehouseMasterData/SKU/CreateSKU';
import WarehouseMasterDataSKUDetail from 'pages/WarehouseMasterData/SKU/Detail';
import DeliveryNotice from 'pages/DeliveryNotice';
import DeliveryNoticeCreate from 'pages/DeliveryNotice/Create';
import DeliveryNoticeOverview from 'pages/DeliveryNotice/Overview';
import DeliveryNoticeEdit from 'pages/DeliveryNotice/Edit';
import DeliveryNoticeSKU from 'pages/DeliveryNotice/SKU';
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
                <Route exact path='/warehouse-master-data' component={WarehouseMasterData} />
                <Route exact path='/warehouse-master-data/:id/overview' component={WarehouseMasterDataOverview} />
                <Route exact path='/warehouse-master-data/:id/sku' component={WarehouseMasterDataSKU} />
                <Route exact path='/warehouse-master-data/:id/sku/create' component={WarehouseMasterDataSKUCreate} />
                <Route exact path='/warehouse-master-data/:id/sku/:item_id' component={WarehouseMasterDataSKUDetail} />
                <Route exact path='/delivery-notice/' component={DeliveryNotice} />
                <Route exact path='/delivery-notice/create' component={DeliveryNoticeCreate} />
                <Route exact path='/delivery-notice/:id/overview' component={DeliveryNoticeOverview} />
                <Route exact path='/delivery-notice/:id/edit' component={DeliveryNoticeEdit} />
                <Route exact path='/delivery-notice/:id/sku' component={DeliveryNoticeSKU} />
                <Route><Redirect to='/' /></Route>
              </Switch>
            </animated.main>
          </Router>
        </SnackbarProvider>
      </AuthenticationProvider>
    </div>
  );
}

export default App;

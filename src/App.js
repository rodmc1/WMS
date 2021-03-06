import './App.scss';
import React from 'react';
import history from 'config/history';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

import { AuthenticationProvider } from 'context/Authentication';
import { SnackbarProvider } from 'context/Snackbar';
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Dashboard from 'pages/Dashboard';
import WarehouseList from 'pages/WarehouseList';
import WarehouseOverview from 'pages/WarehouseList/WarehouseOverview';
import WarehouseCreate from 'pages/WarehouseList/WarehouseCreate';
import WarehouseEdit from 'pages/WarehouseList/WarehouseEdit';
import DeliveryNotice from 'pages/DeliveryNotice';
import DeliveryNoticeCreate from 'pages/DeliveryNotice/Create';
import DeliveryNoticeOverview from 'pages/DeliveryNotice/Overview';
import DeliveryNoticeEdit from 'pages/DeliveryNotice/Edit';
import DeliveryNoticeSKU from 'pages/DeliveryNotice/SKU';
import Authentication from 'components/Authentication';
import ReceivingAndReleasing from 'pages/ReceivingAndReleasing';
import DeliveryList from 'pages/ReceivingAndReleasing/Delivery';
import ReceivingItems from 'pages/ReceivingAndReleasing/Delivery/Receiving';
import AuditLog from 'pages/AuditLog';
import SKUManagement from 'pages/SKUManagement';
import SKUManagementCreate from 'pages/SKUManagement/SKU/CreateSKU';
import SKUManagementData from 'pages/SKUManagement/SKU/Detail';
import ClientManagement from 'pages/ClientManagement';
import ClientManagementCreate from 'pages/ClientManagement/Create';
import ClientManagementOverview from 'pages/ClientManagement/Overview';
import ClientManagementEdit from 'pages/ClientManagement/Edit';
import ClientManagementLogs from 'pages/ClientManagement/Logs';
import ClientManagementSKU from 'pages/ClientManagement/SKU';

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
              <Route exact path='/' component={Dashboard} />
                <Route exact path='/warehouse-list' component={WarehouseList} />
                <Route exact path='/warehouse-list/:id/overview/' component={WarehouseOverview} />
                <Route exact path='/warehouse-list/warehouse-create' component={WarehouseCreate} />
                <Route exact path='/warehouse-list/:id/warehouse-edit' component={WarehouseEdit} />
                <Route exact path='/sku-management' component={SKUManagement} />
                <Route exact path='/sku-management/create' component={SKUManagementCreate} />
                <Route exact path='/sku-management/:id' component={SKUManagementData} />
                <Route exact path='/client-management' component={ClientManagement} />
                <Route exact path='/client-management/create' component={ClientManagementCreate} />
                <Route exact path='/client-management/:id/overview' component={ClientManagementOverview} />
                <Route exact path='/client-management/:id/edit' component={ClientManagementEdit} />
                <Route exact path='/client-management/:id/sku' component={ClientManagementSKU} />
                <Route exact path='/client-management/:id/logs' component={ClientManagementLogs} />
                <Route exact path='/delivery-notice/' component={DeliveryNotice} />
                <Route exact path='/delivery-notice/create' component={DeliveryNoticeCreate} />
                <Route exact path='/delivery-notice/:id/overview' component={DeliveryNoticeOverview} />
                <Route exact path='/delivery-notice/:id/edit' component={DeliveryNoticeEdit} />
                <Route exact path='/delivery-notice/:id/sku' component={DeliveryNoticeSKU} />
                <Route exact path='/receiving-and-releasing' component={ReceivingAndReleasing} />
                <Route exact path='/receiving-and-releasing/:id' component={DeliveryList} />
                <Route exact path='/receiving-and-releasing/:id/:item_id' component={ReceivingItems} />
                <Route exact path='/audit-log' component={AuditLog} />
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

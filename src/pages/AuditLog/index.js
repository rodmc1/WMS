/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import history from 'config/history';
import React, { useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { fetchDeliveryNotices, fetchDeliveryNoticeByName, fetchAllDeliveryNotice } from 'actions';

import Table from 'components/Table';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import Snackbar from '@material-ui/core/Snackbar';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles2 = makeStyles({
  toolbar: {
    display: 'flex',
    padding: '12px 20px',
    background: '#FFF',
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
  },
  pagination: {
    flex: 1,
    '& button': {
      padding: '0'
    }
  },
  filter: {
    position: 'relative'
  },
  input: {
    backgroundColor: '#e8e8e8',
    padding: '20px 60px',
    width: '80%',
    border: 'none'
  },
  noBorder: {
    border: "none",
  },
});

function AuditLog(props) {
  const classes = useStyles2();
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [focusedInput, setFocusedInput] = React.useState();
  const [query, setQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const routes = [{ label: 'Delivery Notice', path: '/delivery-notice' }];

  // Handle Search input
  const handleInputChange = (event) => {
    console.log(event.target.value);
  }

  return (
    <div className="container audit-log-container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2} direction="row" justify="space-evenly" alignItems="stretch">
        <Grid item xs={12} md={12}>
          <Paper className="paper" elevation={0} variant="outlined">
            <div className={classes.filter}>
              <FormControl className="search_form">
                <OutlinedInput
                  style={{backgroundColor: '#E9E9E9'}}
                  variant="standard"
                  placeholder="Search"
                  value={query}
                  autoComplete="off"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search style={{ color: '#828282' }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <CircularProgress className="search__spinner" style={{display: searchLoading ? '' : 'none'}} />
                    </InputAdornment>
                  }
                  classes={{notchedOutline:classes.noBorder}}
                />
              </FormControl>
            </div>
            <div className="button-group">
              <DateRangePicker
                startDate={startDate}
                startDateId="start-date"
                endDate={endDate}
                endDateId="end-date"
                onDatesChange={({ startDate, endDate }) => {
                  setStartDate(startDate);
                  setEndDate(endDate);
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
              />
              <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }}>Download CSV</Button>
            </div>
            <div className="paper__divider" />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default AuditLog;
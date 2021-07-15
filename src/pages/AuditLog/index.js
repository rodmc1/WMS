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
import { fetchAuditLogs } from 'actions';

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

import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

const useStyles2 = makeStyles(theme => ({
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
  noBorder: {
    border: "none",
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

function AuditLog(props) {
  const classes = useStyles2();
  const [expanded, setExpanded] = React.useState(false);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [focusedInput, setFocusedInput] = React.useState();
  const [query, setQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const routes = [{ label: 'Audig Log', path: '/audit-log' }];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Handle Search input
  const handleInputChange = (event) => {
    console.log(event.target.value);
  }

  React.useEffect(() => {
    props.fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  return (
    <div className="container audit-log-container">
      <Breadcrumbs routes={routes} />
      <Paper className="paper" elevation={0} variant="outlined">
        <Grid container spacing={3} direction="row" alignItems="stretch">
          <Grid item xs={3} md={3}>
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
            </div>
          </Grid>
          <Grid item xs={7} md={7}>
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
          </Grid>
          <Grid item xs={2} md={2}>
            <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }}>Download CSV</Button>
          </Grid>
        </Grid>
        <div className="paper__divider" />
        <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar aria-label="recipe" className={classes.avatar}>R</Avatar>}
        action={
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
      </Paper>
    </div>
  )
}

/**
 * Redux states to component props
 */
 const mapStateToProps = state => {
  return { 
    error: state.error,
    logs: state.logs
  }
};

export default connect(mapStateToProps, { fetchAuditLogs })(AuditLog);
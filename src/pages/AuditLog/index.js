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
import { fetchAuditLogs, fetchfilteredAuditLog } from 'actions';

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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
  const csvLink = useRef();
  const classes = useStyles2();
  const [csvData, setCsvData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [focusedInput, setFocusedInput] = React.useState();
  const [query, setQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [auditLog, setAuditLog] = React.useState(false);
  const [search, setSearched] = React.useState('');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const routes = [{ label: 'Audig Log', path: '/audit-log' }];

  const handleExpandClick = (index) => {
    index === expanded ? setExpanded(false) : setExpanded(index);
  };

  // Handle Search input
  const handleInputChange = event => {
    setQuery(event.target.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce(() => {
    setSearchLoading(true);
    props.fetchfilteredAuditLog({
      filter: query
    })
  }, 510), [query]);

  // Function for CSV Download  
  const handleDownloadCSV = () => {
    const newData = props.logs.data.map(log => {
      return {
        name: 'Full Name',
        action: log.action,
        details: log.message,
      }
    });

    setCsvData(newData);
    csvLink.current.link.click();
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Name", key: "name" },
    { label: "Action", key: "action" },
    { label: "Details", key: "details" },
  ];

  /**
   * Call delayedQuery function when user search and set new delivery notice data
   */
     React.useEffect(() => {
      if (query) {
        delayedQuery();
      } else if (!query) {
        setAuditLog(props.logs.data);
        setSearchLoading(false);
      }
      return delayedQuery.cancel;
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [query]);
  

  React.useEffect(() => {
    props.fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  React.useEffect(() => {
    console.log(startDate);
    console.log(endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [startDate, endDate]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
    }
  }, [props.searched]);

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
            <CSVLink data={csvData} filename="audit-log.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
            <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
          </Grid>
        </Grid>
        <div className="paper__divider" />
        {props.logs.data && props.logs.data.map((log, index) => {
          return (
            <Card elevation={0} key={index}>
              <CardHeader
                avatar={<Avatar aria-label="recipe" className={classes.avatar}><AccountCircleIcon /></Avatar>}
                action={
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded === index,
                    })}
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded === index}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                }
                title={log.message}
                subheader={moment(log.stamp).format('DD-MMM-YYYY [at] hh:mm A')}
              />
              <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography>
                    {log.action}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          )
        })}
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
    logs: state.logs,
    searched: state.logs.search
  }
};

export default connect(mapStateToProps, { fetchAuditLogs, fetchfilteredAuditLog })(AuditLog);
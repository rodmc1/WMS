/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { connect } from 'react-redux';
import { SingleDatePicker } from "react-dates";
import { makeStyles } from '@material-ui/core/styles';
import { fetchAuditLogs, fetchfilteredAuditLog } from 'actions';

import Button from '@material-ui/core/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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
    paddingTop: '56.25%',
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
  const [focused, setFocused] = React.useState();
  const [query, setQuery] = React.useState('');
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [auditLog, setAuditLog] = React.useState(null);
  const [searched, setSearched] = React.useState('');
  const [date, setDate] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const routes = [{ label: 'Audit Log', path: '/audit-log' }];

  // Handle Search input
  const handleInputChange = event => {
    setQuery(event.target.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce(date => {
    setSearchLoading(true);
    props.fetchfilteredAuditLog({
      filter: query,
      date: date
    })
  }, 510), [query]);

  // Function for CSV Download  
  const handleDownloadCSV = () => {
    csvLink.current.link.click();
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Name", key: "fullname" },
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
    if (date) {
      delayedQuery(date.format("MM/DD/YYYY"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [date]);

  React.useEffect(() => {
    props.fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  React.useEffect(() => {
    if (props.logs.data) {
      setAuditLog(props.logs.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.logs.data]);

  React.useEffect(() => {
    if (auditLog) {
      const newData = auditLog.map(log => {
        return {
          fullname: log.fullname,
          action: log.action,
          details: log.message,
        }
      });

      setCsvData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [auditLog]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (searched) {
      setAuditLog(searched);
      setSearchLoading(false)
    }
  }, [searched]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched);
      if (!props.searched.length && (query || date)) {
        setInterval(() => {setReady(true)}, 300);
      } else {
        setReady(false)
      }
    }
  }, [props.searched]);

  const handleDate = date => {
    setDate(date);
  }

  const handleFocus = ({focused}) => {
    setFocused(focused)
  }

  const renderIcon = (str) => {
    if (str.match(/created/)) return <AddCircleIcon className="log-action-icon created" />;
    if (str.match(/changed/) || str.match(/updated/)) return <CreateIcon className="log-action-icon updated" />;
    if (str.match(/deleted/)) return <CreateIcon className="log-action-icon deleted" />;
    if (str.match(/added/)) return <CreateIcon className="log-action-icon added" />;
    else return <CreateIcon className="log-action-icon updated" />;
  }

  const renderMessage = str => {
    if (str.match(/logged in/)) {
      return str.substring(0, str.indexOf('logged in') + 'logged in'.length); 
    } else {
      return str;
    }
  }

  return (
    <div className="container audit-log-container">
      <Breadcrumbs routes={routes} />
      <Paper className="paper log-list" elevation={0} variant="outlined">
        <Grid container spacing={3} direction="row" alignItems="stretch">
          <Grid item xs={3} md={3}>
            <div className="button-group">
              <SingleDatePicker
                date={date}
                onDateChange={handleDate} 
                focused={focused}
                onFocusChange={handleFocus} 
                id="log-date-picker"
                showDefaultInputIcon
                isOutsideRange={() => false}
                inputIconPosition="after"
                numberOfMonths={1}
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
        {auditLog && auditLog.map((log, index) => {
          return (
            <React.Fragment>
              {renderIcon(log.message)}
              <Card elevation={0} key={index}>
                <CardHeader
                  avatar={<Avatar aria-label="recipe" className={classes.avatar}>{log.fullname.charAt(0)}</Avatar>}
                  title={renderMessage(log.message)}
                  subheader={moment(log.stamp).format('DD-MMM-YYYY [at] hh:mm A')}
                />
              </Card>
            </React.Fragment>
          )
        })}
        {ready ? <Typography className="nrf">No Results Found</Typography> : ''}
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
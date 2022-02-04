import './style.scss';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Search from '@mui/icons-material/Search';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LastPageIcon from '@mui/icons-material/LastPage';
import FormControl from '@mui/material/FormControl';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Chip from '@mui/material/Chip';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Tooltip from '@mui/material/Tooltip';

const useStyles1 = makeStyles({
  root: {
    flexShrink: 0,
  },
});


/*
 * Handler for warehouse list pagination actions
 * @args pages and functions
 */
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  // Pagination
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  // Pagination
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  // Pagination
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  // Pagination
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

// Table pagination prototypes
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

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

export default function Table_({ filterSize, searchLoading, handleRowCount, query, data, total, config, onInputChange, onPaginate, onRowClick, handleTagClient, handleOpenClientTagging }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const keys = config.headers.map(h => h.key);
  const [tableData, setTableData] = React.useState([]);

  // Handles page updates
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle single page update
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Search input
  const handleInputChange = (event) => {
    onInputChange(event);
    setPage(0);
  }

  /*
  * @args str url
  * @return formatted image src
  */
  const extractImageUrl = (str) => {
    return str && str.replace(/\\/g,"/").replace("/files",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
  }

  // Show default image if image source is broken
  const handleImageError = (e) => {
    e.target.src = '/assets/images/default-image.png';
  }

  const renderPreview = preview => {
    let defaultImage = '/assets/images/default-image.png';
    if (Array.isArray(preview)) defaultImage = extractImageUrl(preview[0].item_filepath);
    
    return <img src={defaultImage} onError={handleImageError} className="table-img-preview" alt="" />
  }

  const openTagClient = (event, data) => {
    event.stopPropagation();
    handleOpenClientTagging(true);
    handleTagClient(data)
  }

  const renderTableCell = (data, type) => {
    let cellData = data;

    if (type === 'item_document_file_type') cellData = renderPreview(data);
    if (type === 'booking_datetime') cellData = moment(data).format('MM/DD/YYYY h:mm a');
    if (type === 'appointment_datetime') cellData = moment(data).format('MM/DD/YYYY h:mm a');
    if (type === 'status') cellData = renderStatus(data);
    if (type === 'physical_count') cellData = data ? data : 0;
    if (type === 'item_id') {
      cellData = (
        <Tooltip title="Tag Client" onClick={(e) => openTagClient(e, data)} >
          <IconButton style={{color: '#009688'}} aria-label="Tag Client">
            <AddLinkIcon className="hover-button--on" />
          </IconButton>
        </Tooltip>
      )
    } 

    return cellData;
  }

  const renderTableWidth = (data, type) => {
    let width = '400px';
    if (type === 'item_code') width = '300px';

    return width;
  }

  const renderStatus = data => {
    let jsx = <Chip label={data} className="status-chip" />
    if (data === 'Completed') jsx = <Chip label="Completed" className="status-chip emerald" />
    if (data === 'In-Progress') jsx = <Chip label="In-Progress" className="status-chip tangerine" />;
    if (data === 'ACCREDITED') jsx = <Chip label="Accredited" className="status-chip blue" />;
    if (data === 'POTENTIAL') jsx = <Chip label="Potential" className="status-chip green" />;
    if (data === 'ON CAll') jsx = <Chip label="On Call" className="status-chip gold" />;
    if (data === 'LOCK IN') jsx = <Chip label="Lock In" className="status-chip tangerine" />;
    if (data === 'REGULAR') jsx = <Chip label="Regular" className="status-chip emerald" />;
    if (data === 'OTHERS') jsx = <Chip label="Others" className="status-chip" />;
    return jsx
  }

  // Setter for table data
  React.useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data, config.headers, config.rowsPerPage])

  // Set the page number and item count for searched items
  React.useEffect(() => {
    handleRowCount(page, rowsPerPage);
    onPaginate(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [page, rowsPerPage]);
  
  return (
    <React.Fragment>
      <div className={classes.toolbar}>
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
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[5, 10, 25]}
          count={Number(total)}
          rowsPerPage={rowsPerPage}
          page={page}
          component="div"
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
      <Paper className={classes.root} className="main-table-root">
        <TableContainer>
          <Table aria-label="custom pagination table" className="warehouse_table">  
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  index !== 0 && 
                  <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                ((!tableData.length && Array.isArray(tableData)) || JSON.stringify(tableData) === '{}') && 
                <TableRow className="table__row">
                  <TableCell 
                    colSpan={12}
                    style={{
                      whiteSpace: 'nowrap',
                      overFlow: 'hidden',
                      textOverFlow: 'ellipsis'
                    }} 
                    align="center">
                      No results found
                  </TableCell>
                </TableRow>
              }
              {Object.values(tableData).map((d, i) => {
                return (
                  <TableRow key={i} onClick={() => onRowClick(d)} className="table__row hover-button">
                    {
                      keys.map((k, index) => {
                        return (
                          index !== 0 &&
                          <TableCell 
                            title={d[k]}
                            style={{
                              maxWidth: renderTableWidth(d[k], k),
                              overflowX: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }} 
                            align={config.headers[index] ? config.headers[index].align : 'left'}
                            key={index}>
                              {renderTableCell(d[k], k)}
                          </TableCell>
                        )
                      })
                    }
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </React.Fragment>
  );
}
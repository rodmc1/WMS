import './style.scss';
import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import Search from '@material-ui/icons/Search';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CircularProgress from '@mui/material/CircularProgress';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import UploadDocument from './UploadDocument';
import useForceUpdate from 'use-force-update';

const useStyles1 = makeStyles({
  root: {
    flexShrink: 0,
    marginLeft: 8
  },
});

/*
 * Handler for warehouse list pagination actions
 * @args pages and functions
 */
function TablePaginationActions(props) {
  const theme = useTheme();
  const classes = useStyles1();
  const { count, page, rowsPerPage, onChangePage } = props;

  // Pagination
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  // Pagination
  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  // Pagination
  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  // Pagination
  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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
  onChangePage: PropTypes.func.isRequired,
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

export default function Table_({ onSubmit, handleUploadDocument, addMode, onError, defaultData, searchLoading, handleRowCount, query, total, config, onInputChange, onPaginate, onRowClick, handleCancel }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const [tableData, setTableData] = React.useState([]);
  const [openUpload, setOpenUpload] = React.useState(false);
  const [uploadData, setUploadData] = React.useState(null);
  const forceUpdate = useForceUpdate();

  // Hook Form
  const { errors, control, getValues } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

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

  // Set the page number and item count for searched items
  React.useEffect(() => {
    handleRowCount(page, rowsPerPage);
    onPaginate(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [page, rowsPerPage]);

  /**
   * @args str url
   * @return formatted image src
   */
  const extractImageUrl = (str) => {
    return str && str.replace(/\\/g,"/").replace("wwwroot",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
  }

  // Show default image if image source is broken
  const handleImageError = (e) => {
    e.target.src = '/assets/images/default-image.png';
  }

  const handleSave = () => {
    const values = getValues([`containerVanNumber`, `serialNumber`, `trucker`, `plateNumber`, `driverName`, 'dateStart', 'dateEnd', 'notes']);

    if (_.isEmpty(errors)) {
      onSubmit(values);
    } else {
      onError(errors)
    }
  }

  // Setter for table data
  React.useEffect(() => {
    if (defaultData) {
      setTableData(defaultData);
    }
  }, [defaultData]);

  const handleOpenUpload = (event, data) => {
    event.stopPropagation();
    setOpenUpload(true);
    setUploadData(data);
  }

  const handleClose = () => {
    forceUpdate();
    setOpenUpload(false);
  }
  
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
        <div className={classes.pagination}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={Number(total)}
            rowsPerPage={rowsPerPage}
            page={page}
            component="div"
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      </div>
      <Paper sx={{flexShrink: 0}}>
        <TableContainer>
          <Table aria-label="custom pagination table" className="warehouse_table">  
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  (index !== 0 && (header !== "No. of SKU" && addMode)) &&
                  <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={header}>{header}</TableCell>
                ))}
                {headers.map((header, index) => (
                  (index !== 0 && !addMode) &&
                  <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                ((!tableData.length && Array.isArray(tableData) && !addMode) || JSON.stringify(tableData) === '{}' && !addMode) && 
                <TableRow className="table__row">
                  <TableCell colSpan={12} align="center" className="no-results-row">No Data found</TableCell>
                </TableRow>
              }
              { !addMode ? Object.values(tableData).map((data, i) => 
                <TableRow key={data.recieved_id} className="table__row receiving-releasing-table hover-button" onClick={() => onRowClick(data)}>
                  <TableCell>{data.sku_count}</TableCell>
                  <TableCell>{data.container_van_no}</TableCell>
                  <TableCell>{data.serial_no}</TableCell>
                  <TableCell>{data.trucker}</TableCell>
                  <TableCell>{data.plate_number}</TableCell>
                  <TableCell>{data.driver_name}</TableCell>
                  <TableCell>{moment( data.date_in).format('MM/DD/YYYY hh:mm a')}</TableCell>
                  <TableCell>{moment( data.date_out).format('MM/DD/YYYY hh:mm a')}</TableCell>
                  <TableCell>{data.notes}</TableCell>
                  <TableCell>
                    <Tooltip title="Upload Document" onClick={(e) => handleOpenUpload(e, data)}>
                      <IconButton sx={{color: '#009688'}} aria-label="Upload Document">
                        <UploadFileIcon className="hover-button--on" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ) : 
                <TableRow className="table__row receiving-releasing-table-addmode">
                  <TableCell>
                    <Controller name={`containerVanNumber`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required fullWidth/>}
                    /> 
                  </TableCell>
                  <TableCell>
                    <Controller name={`serialNumber`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required fullWidth/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller name={`trucker`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required fullWidth/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller 
                      name={`plateNumber`}
                      control={control}
                      rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required fullWidth/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller name={`driverName`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required fullWidth/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller name={`dateStart`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="datetime-local" required />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller name={`dateEnd`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="datetime-local"  InputLabelProps={{shrink: true }} class="datetime" required />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller name={`notes`} control={control} rules={{ required: "This field is required" }}
                      as={<TextField variant="outlined" type="text" required/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Save">
                      <IconButton color="primary" aria-label="save" component="span" onClick={handleSave}>
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton color="secondary" aria-label="cancel" component="span" onClick={() => handleCancel()}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {openUpload && <UploadDocument data={uploadData} open={openUpload} handleClose={handleClose} handleUploadDocument={handleUploadDocument} />}
    </React.Fragment>
  );
}
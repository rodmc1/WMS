import './style.scss';
import _ from 'lodash';
import React from 'react';
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
import WarehouseDialog from 'components/WarehouseDialog';

import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const classes = useStyles1();
  const theme = useTheme();
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

export default function Table_({ onSubmit, onError, defaultData, searchLoading, handleRowCount, query, data, total, config, onInputChange, onPaginate, handleRemoveSKU, onRowClick, handleCancel }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const [tableData, setTableData] = React.useState([]);
  const [addMode, setAddMode] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({open: false});
  const [removeSKU, setRemoveSKU] = React.useState(null);
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false);

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

  /**
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

  const toggleRemoveSKU = (data) => {
    setRemoveSKU(data)
    setOpenRemoveDialog(true);
  }

  const handleRemove = () => {
    handleRemoveSKU(removeSKU);
    setOpenRemoveDialog(false);
  }

  const handleClose = () => {
    setOpenRemoveDialog(false);
  }

  // Setter for table data
  React.useEffect(() => {
    if (defaultData) {
      setTableData(defaultData);
      setAddMode(false);
    }
    if (data.length) {
      setTableData(data);
      setAddMode(true);
    }
  }, [data, defaultData]);

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
      <Paper className={classes.root} className="">
        <TableContainer>
          <Table aria-label="custom pagination table" className="tag-sku-table">  
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
                  <TableCell colSpan={12} align="center" className="no-results-row">No Data Found</TableCell>
                </TableRow>
              }
              {Object.values(tableData).map((data, i) => 
                <TableRow key={data.item_id} className="table__row sku-table hover-button">
                  <TableCell key={i}>{renderPreview(data.item_document_file_type ? data.item_document_file_type : data.item_document_file)}</TableCell>
                  <TableCell style={{maxWidth: 200}} title={data.product_name} key={i+'product_name'}>{data.product_name}</TableCell>
                  <TableCell key={i+'uom'}>{data.uom_description ? data.uom_description : data.uom} </TableCell>
                  <TableCell style={{maxWidth: 200}} title={data.item_code}>{data.item_code}</TableCell>
                  <TableCell>{data.external_code}</TableCell>
                  <TableCell>
                    <Tooltip title="Remove">
                      <IconButton aria-label="remove" component="span" onClick={() => toggleRemoveSKU(data)}>
                        <LinkOffIcon className="hover-button--on" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog
        className="remove-sku-tag-dialog"
        open={openRemoveDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        keepMounted
      >
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-space-between align-center">
            <Typography>Confirmation</Typography>
            <Tooltip title="Close">
              <IconButton aria-label="close" component="span" onClick={handleClose} >
                <ClearIcon style={{fontSize: 18}} />
              </IconButton>
            </Tooltip>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this SKU?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleRemove}>Remove</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
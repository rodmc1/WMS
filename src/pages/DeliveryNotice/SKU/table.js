import './style.scss';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Search from '@material-ui/icons/Search';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import FormControl from '@material-ui/core/FormControl';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
}));

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

export default function Table_({ onSubmit, onError, defaultData, searchLoading, handleRowCount, query, data, total, config, onInputChange, onPaginate, onRowClick, handleCancel }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const [tableData, setTableData] = React.useState([]);
  const [addMode, setAddMode] = React.useState(false);

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
    return str && str.replace(/\\/g,"/").replace("wwwroot",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
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

  const handleSave = (data, i) => {
    const values = getValues([`externalCode${data.item_id}`, `productName${data.item_id}`, `uom${data.item_id}`, `expectedQty${data.item_id}`, `notes${data.item_id}`]);
    const rowData = {
      externalCode: values[`externalCode${data.item_id}`],
      productName: values[`productName${data.item_id}`],
      expectedQty: values[`expectedQty${data.item_id}`],
      notes: values[`notes${data.item_id}`],
      code: data.item_code,
      id: data.item_id
    }

    if (_.isEmpty(errors)) {
      onSubmit(rowData);
    } else {
      onError(errors)
    }
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
      <Paper className={classes.root}>
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
                  <TableCell colSpan={12} align="center" className="no-results-row">No results found</TableCell>
                </TableRow>
              }
              {Object.values(tableData).map((data, i) => 
                <TableRow key={data.item_id} className="table__row sku-table">
                  <TableCell key={i}>{renderPreview(data.item_document_file_type ? data.item_document_file_type : data.item_document_file)}</TableCell>
                  <TableCell key={i+'item_code'}>{data.item_code}</TableCell>
                  <TableCell key={i+'external_code'}>
                    {addMode ? 
                      <Controller name={`externalCode${data.item_id}`} control={control} rules={{ required: "This field is required" }} defaultValue={data.external_code}
                        as={<TextField variant="outlined" type="text" className="external-code" required fullWidth/>}
                      /> :
                      data.external_material_coding
                    }
                    </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller name={`productName${data.item_id}`} control={control} rules={{ required: "This field is required" }} defaultValue={data.product_name}
                        as={<TextField variant="outlined" type="text" className="product-name" required fullWidth/>}
                      />:
                      data.external_material_description
                    }
                  </TableCell>
                  <TableCell>
                    {data.uom_description ? data.uom_description : data.uom}
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller 
                        name={`expectedQty${data.item_id}`}
                        control={control}
                        rules={{ 
                          required: "This field is required",
                          validate: value => { return value < 0 ? 'Invalid value' : true } 
                        }}
                        defaultValue={data.expected_qty ? data.expected_qty : 0}
                        as={<TextField variant="outlined" type="number" className="expected-quantity" required fullWidth/>}
                      /> :
                      data.expected_qty
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller name={`notes${data.item_id}`} control={control} rules={{ required: "This field is required" }} defaultValue={data.notes ? data.notes : "None"}
                        as={<TextField variant="outlined" type="text" className="notes" required fullWidth/>}
                      /> :
                      data.notes
                    }
                  </TableCell>
                  <TableCell>
                    {addMode &&
                      <>
                        <Tooltip title="Save">
                          <IconButton color="primary" aria-label="save" component="span" onClick={() => handleSave(data, i)}>
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton color="secondary" aria-label="cancel" component="span" onClick={() => handleCancel(data)}>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </React.Fragment>
  );
}
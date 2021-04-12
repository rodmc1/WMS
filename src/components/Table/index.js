import './style.scss';
import React from 'react';
import { useForm } from "react-hook-form";

import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import LastPageIcon from '@material-ui/icons/LastPage';
import MenuItem from '@material-ui/core/MenuItem';
import Search from '@material-ui/icons/Search';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  toolbar: {
    marginTop: '20px',
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
    flex: 2,
    position: 'relative'
  },
  input: {
    backgroundColor: '#e8e8e8',
    padding: '20px 60px',
    width: '100%',
    border: 'none'
  }
});

export default function CustomPaginationActionsTable({ onSelectSearchItem, data, total, config, onInputChange, onSubmit, onPaginate, onRowClick, searchedOptions }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const keys = config.headers.map(h => h.key);
  const [tableData, setTableData] = React.useState([]);
  
  const { register, handleSubmit } = useForm();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data, config.headers, config.rowsPerPage])

  React.useEffect(() => {
    onPaginate(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [page, rowsPerPage]);

  const hadleSearchSubmit = (data) => {
    setSearchOpen(true);
    onSubmit(data);
  }

  return (
    <React.Fragment>
      <div className={classes.toolbar}>
        <div className={classes.filter}>
          <form onSubmit={handleSubmit(hadleSearchSubmit)} className="search_form">
            <Search 
              id="route-search__submit"
              style={{
              position: 'absolute',
              left: 0,
              top: 0,
              cursor: 'pointer',
              width: '64px',
              height: '56px',
              padding: '16px',
            }} onClick={onSubmit} />
            <input type="text" placeholder="Search" className={classes.input} id="route-search__input" name="query" ref={register} autoComplete="off" onChange={(e) => {
              onInputChange(e.target.value);
            }} />
            {
              searchOpen ?
              <ArrowDropUp 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  cursor: 'pointer',
                  width: '64px',
                  height: '56px',
                  padding: '16px'
                }}
                onClick={() => setSearchOpen(!searchOpen)}
              /> :
              <ArrowDropDown 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  cursor: 'pointer',
                  width: '64px',
                  height: '56px',
                  padding: '16px'
                }}
                onClick={() => setSearchOpen(!searchOpen)}
              />
            }
            
            <div className={searchOpen ? 'menu-list' : 'menu-list hidden'}>
              {
                searchedOptions && searchedOptions.map(option => {
                  return <MenuItem key={option.warehouse_id} onClick={() => onSelectSearchItem(option.warehouse_id)}>{option.warehouse_client}</MenuItem>
                })
              }
            </div>
          </form>
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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">  
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                  index !== 0 && 
                  <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(tableData).map((d, i) => {
              return (
                <TableRow key={i} onClick={() => onRowClick(d)} className="table__row">
                  {
                    keys.map((k, index) => {
                      return (
                        index !== 0 &&
                        <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={index}>{d[k]}</TableCell>
                      )
                    })
                  }
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
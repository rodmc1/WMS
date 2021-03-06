import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { fetchDeliveryNotices, fetchReceivingItem, fetchAllDeliveryNoticeSKU, searchReceivingAndReleasingItem, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchReceivingAndReleasingSKU, fetchAllWarehouseSKUs } from 'actions';

import Grow from "@mui/material/Grow";
import Button from '@mui/material/Button';
import Popper from "@mui/material/Popper";
import Spinner from '@mui/material/Backdrop';
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

// package for print
import ReactToPrint from 'react-to-print';

// component for the printable form
import PrintableForms from '../PrintableForms';

// logo for the excel
import ExcelPDFLogo from '../../../../assets/json/excel-logo-json.json';

import Cookies from 'universal-cookie';
import inteluck from 'api/inteluck';

const exceljs = require('exceljs');
const cookie = new Cookies();

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
    position: 'relative',
    display: 'flex',
    width: '63%'
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

// Table config
const config = {
  rowsPerPage: 10,
  headers: [
    { label: 'ID'},
    { label: 'SKU Code' },
    { label: 'Expected Quantity'},
    { label: 'Actual Quantity' },
    { label: 'CBM' },
    { label: 'UOM' },
    { label: 'Discrepancy'},
    { label: 'Damaged' },
    { label: 'Actual Pull Out Date' },
    { label: 'Inspected by' },
    { label: 'Inspection Notes' },
    { label: ' ' },
  ]
}

function Table_(props) {
  const receivingData = props.receivingData;
  const printComponent = useRef();
  const classes = useStyles2();
  const [rowsPerPage, setRowsPerPage] = React.useState(config.rowsPerPage);
  const headers = config.headers.map(h => h.label);
  const [tableData, setTableData] = React.useState([]);
  const [addMode, setAddMode] = React.useState(false);
  const [SKU, setSKU] = useState([]);
  const [receivingItem, setReceivingItem] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const anchorRef = React.useRef(null);
  const dispatch = useDispatch();
  const [openAddItems, setOpenAddItems] = React.useState(false);
  const [page, setPage]= useState(0);
  const [query, setQuery] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [itemQuery, setItemQuery] = useState('');
  const [searchedItem, setSearchedItem] = useState(null);
  const [selectedSKU, setSelectedSKU] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState([]);
  const [items, setItems] = useState([]);
  const [warehouseSKUs, setwarehouseSKUs] = useState([]);
  const [disableExcelbtn, setDisableExcelbtn] = useState(false);
  const [applyInspected, setApplyInspected] = useState(null)
  const isAllSelected = items.length > 0 && items.length === SKU.length;

  const handleToggle = () => {
    setOpenAddItems((prevOpen) => !prevOpen);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenAddItems(false);
    }
  }

  // Function for getting page and row count on table
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  // Set the page number and item count for searched items
  React.useEffect(() => {
    handleRowCount(page, rowsPerPage);
    handlePagination(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [page, rowsPerPage]);

  // Function for pagination and search
  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      props.fetchReceivingItem({
        received_id: props.receivingData.recieved_id,
        count: rowsPerPage,
        after: page * rowCount,
      });
      if (deliveryNoticeData) {
        let params = {
          delivery_notice_id: deliveryNoticeData.delivery_notice_id,
          count: rowsPerPage,
          after: page * rowsPerPage
        }
        if (!params.after) params = { delivery_notice_id: deliveryNoticeData.delivery_notice_id }
        props.fetchDeliveryNoticeSKU(params);
      }
    }
  };

  const toggleCheckboxValue = (item, bool) => {
    if (!isChecked.includes(item.delivery_notice_item)) {
      setIsChecked(oldArray => [...oldArray, item.delivery_notice_item]);
    } else {
      setIsChecked(isChecked.filter(check => check !== item.delivery_notice_item));
    }

    if (bool) {
      setItems(items.filter(sku => sku.delivery_notice_item !== item.delivery_notice_item));
    } else {
      setItems(oldArray => [...oldArray, item]);
    }
  }

  const checkAll = () => {
    if (isAllSelected) {
      setItems([]);
      setIsChecked([]);
    } else {
      setIsChecked(SKU.map(sku => sku.delivery_notice_item));
      setItems(SKU.map(sku => sku));
    }
  }

  // Function for cancel action
  const handleCancel = (data, allData) => {
    const filteredCheck = isChecked.filter(check => check !== data.delivery_notice_item);
    const filteredItem = items.filter(sku => sku.delivery_notice_item !== data.delivery_notice_item);
    setIsChecked(filteredCheck);
    setSelectedSKU(filteredItem);
    setItems(filteredItem);
  }

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const handleSearchItems = React.useCallback(_.debounce(() => {
    searchReceivingAndReleasingSKU({
      delivery_notice_id: props.receivingData.delivery_noticeid,
      filter: itemQuery,
      count: rowsPerPage,
      after: page * rowCount
    }).then(response => {
      setSearchedItem(response.data);
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
  }, 510), [itemQuery]);


  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchReceivingItem({
        received_id: props.receivingData.recieved_id,
        count: rowsPerPage,
        after: page * rowCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowsPerPage) => {
    setSearchLoading(true);
    props.searchReceivingAndReleasingItem({
      received_id: props.receivingData.recieved_id,
      count: rowsPerPage,
      after: page * rowCount,
      filter: query,
    });

  }, 510), [query]);

  // function for downloading the printable form as Excel
  const handleDownloadPrintableFormAsExcel = async () => {
    const dataObj = {
      received_id: receivingData.recieved_id,
      count: itemCount,
      after: 0,
    }

    setDisableExcelbtn(true)
    const completeRows = await inteluck.get(`/v1/wms/Warehouse/Delivery/Received_Item`, { params: dataObj }).then(res => {return res}).catch(err => {return err});
    setDisableExcelbtn(false);
    if(completeRows.status === 200){
      const tableRows = completeRows.data;
      const excelName = receivingData.transaction_type === 'Inbound' ? `Receiving items from ${receivingData.plate_number}` : `Releasing items from ${receivingData.plate_number}`;
      const workbook = new exceljs.Workbook();

      workbook.creator = 'Me';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      
      const worksheet =  workbook.addWorksheet(excelName, {
        pageSetup:{paperSize: 100, orientation:'landscape'}
      });

      worksheet.properties.defaultColWidth = 20;

      worksheet.views= [
        {zoomScale: 100, showGridLines: true}
      ]

      worksheet.getRow(3).getCell('A').value = receivingData.transaction_type === 'Inbound' ? 'Receiving Report' : 'Withdrawal Slip';
      worksheet.getRow(3).getCell('A').alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
      worksheet.getRow(3).getCell('A').font = {
        name: 'Arial',
        family: 2,
        size: 16,
        underline: false,
        bold: true,
        color: {argb: receivingData.transaction_type === 'Inbound' ? '00009688' : '00FF7E00'}
      }

      worksheet.mergeCells('A1:F1');
      const headerRow = worksheet.getRow(1);
      headerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: receivingData.transaction_type === 'Inbound' ? '00009688' : '00FF7E00'},
      };

      const imageSample = workbook.addImage({
        base64: ExcelPDFLogo.logo,
        extension: 'png',
      });

      worksheet.getRow(3).height = 61.50;
      worksheet.mergeCells('A3:F3');
      worksheet.addImage(imageSample,'D3:F3');

      let startNum = 5;
      const leftArrLabel = [{
        label: 'Client',
        text: receivingData.client_name
      },{
        label: 'Shipper',
        text: receivingData.shipper_name
      },{
        label: 'Transaction Type',
        text: receivingData.transaction_type
      },{
        label: 'Location',
        text: receivingData.warehouse_name
      }]

      const rightArrLabel = [{
        label: receivingData.transaction_type === 'Inbound' ? 'Receiving Report Number' : 'Withdrawal Slip Number',
        text: receivingData.unique_code
      },{
        label: 'Date',
        text: moment(new Date(receivingData.datetime)).format('LL')
      },{
        label: 'Reference Number',
        text: receivingData.reference_number
      }]

      headerRow.getCell(1).font = {
        name: 'Arial',
        family: 2,
        size: 12,
        underline: false,
        bold: true
      }

      const textFont = {
        name: 'Arial',
        family: 2,
        size: 14,
        underline: false,
        bold: true,
        color: {argb: '00333333'}
      }

      const labelFont = {
        name: 'Arial',
        family: 2,
        size: 12,
        underline: false,
        bold: false,
        color: {argb: '00828282'}
      }

      for(let i = 0; i < 4; i++){
        const nextRow = startNum + 1;
        // text
        worksheet.mergeCells(`A${startNum}:B${startNum}`);
        worksheet.getRow(startNum).getCell('A').value = leftArrLabel[i].text;
        worksheet.getRow(startNum).getCell('A').font = textFont;

        // label
        worksheet.mergeCells(`A${nextRow}:B${nextRow}`);
        worksheet.getRow(nextRow).getCell('A').value = leftArrLabel[i].label;
        worksheet.getRow(nextRow).getCell('A').font = labelFont;

        if(rightArrLabel[i]){
          // text
          worksheet.mergeCells(`E${startNum}:F${startNum}`);
          worksheet.getRow(startNum).getCell('E').value = rightArrLabel[i].text;
          worksheet.getRow(startNum).getCell('E').font = textFont;
          worksheet.getRow(startNum).getCell('E').alignment = {vertical: 'middle', horizontal: 'right', wrapText: true};

          // label
          worksheet.mergeCells(`E${nextRow}:F${nextRow}`);
          worksheet.getRow(nextRow).getCell('E').value = rightArrLabel[i].label;
          worksheet.getRow(nextRow).getCell('E').font = labelFont;
          worksheet.getRow(nextRow).getCell('E').alignment = {vertical: 'middle', horizontal: 'right', wrapText: true};
        }

        startNum = nextRow + 2;
      }

      // header row
      const headerArr = ["ITEM #","DESCRIPTION","CODE","QTY","UNIT","EXP DATE"];
      headerArr.forEach((item, key) => {
        worksheet.getRow(17).getCell(key + 1).value = item;
        worksheet.getRow(17).getCell(key + 1).font = {
          color: {argb: '00ffffff'}
        }
        worksheet.getRow(17).getCell(key + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: '0080808061'},
        };
      })

      // body rows
      let startRow = 18;
      tableRows.forEach((item, key) => {
        const row = [
          key + 1,
          item.product_name,
          item.external_code,
          item.actual_quantity,
          item.unit,
          moment(new Date(item.actual_arrived_date_time)).format('L')
        ]

        row.forEach((rowItem, rowKey) => {
          worksheet.getRow(startRow).getCell(rowKey + 1).value = rowItem;
          worksheet.getRow(startRow).getCell(rowKey + 1).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
        })

        startRow = startRow + 1;
      })

      // remarks section
      const remarksRow = startRow + 1;
      let lastRemarksRow;
      for(let i = remarksRow; i <= remarksRow + 3; i++){
        worksheet.mergeCells(`A${i}:F${i}`);
        if(i === remarksRow) worksheet.getRow(i).getCell('A').value = 'Remarks';

        headerArr.forEach((item, key) => {
          const borderStyle = {
            left: {style:'thin', color: {argb:'00ffffff'}},
            bottom: {style:'thin', color: {argb: i === remarksRow + 3 ? '00000000' : '00ffffff'}}
          }

          if(i !== remarksRow){
            borderStyle.top = {style:'thin', color: {argb: '00ffffff'}}
          }

          if(key !== headerArr.length - 1){
            borderStyle.right = {style:'thin', color: {argb: '00ffffff'}}
          }

          worksheet.getRow(i).getCell(key + 1).border = borderStyle;
        })

        lastRemarksRow = i;
      }

      // bottom section
      const bottomRow = lastRemarksRow + 2;
      for(let i = 1; i <= 6; i++){
        worksheet.getRow(bottomRow).getCell(i).border = {
          top: {style:'mediumDashed', color: {argb: '00000000'}}
        }
      }
      worksheet.mergeCells(`A${bottomRow}:F${bottomRow}`);

      const labelsBottomRow = bottomRow + 1;
      let lowerBottomRow;
      for(let i = labelsBottomRow; i <= labelsBottomRow + 2; i++){
        if(i === labelsBottomRow){
          worksheet.mergeCells(`A${i}:B${i}`);
          worksheet.getRow(i).getCell('A').value = receivingData.transaction_type === 'Inbound' ? 'Received and Checked by' : 'Released and Checked by';
          worksheet.mergeCells(`E${i}:F${i}`);
          worksheet.getRow(i).getCell('E').value = 'Noted by';
        }else{
          worksheet.mergeCells(`A${i}:B${i}`);
          worksheet.getRow(i).getCell('A').border = {top: {style:'thin', color: {argb: '00ffffff'}}};
          worksheet.mergeCells(`E${i}:F${i}`);
          worksheet.getRow(i).getCell('E').border = {top: {style:'thin', color: {argb: '00ffffff'}}};
        }

        if(i === labelsBottomRow + 2){
          worksheet.getRow(i).getCell('A').border = {
            top: {style:'thin', color: {argb: '00ffffff'}},
            bottom: {style:'thin', color: {argb: '00000000'}}
          };
          worksheet.mergeCells(`A${i+1}:B${i+1}`);
          worksheet.getRow(i + 1).getCell('A').value = 'Warehouse Assistant';
          worksheet.getRow(i + 1).getCell('A').alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};

          worksheet.getRow(i).getCell('E').border = {
            top: {style:'thin', color: {argb: '00ffffff'}},
            bottom: {style:'thin', color: {argb: '00000000'}}
          };
          worksheet.mergeCells(`E${i+1}:F${i+1}`);
          worksheet.getRow(i + 1).getCell('E').value = 'Supervisor/Manager';
          worksheet.getRow(i + 1).getCell('E').alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
          lowerBottomRow = i + 3;
        }
      }

      worksheet.getRow(lowerBottomRow).getCell('A').value = receivingData.transaction_type === 'Inbound' ? 'Delivered by' : 'Received by';
      for(let i = lowerBottomRow; i <= lowerBottomRow + 2; i++){
        worksheet.mergeCells(`A${i}:F${i}`);

        headerArr.forEach((item, key) => {
          const borderStyle = {
            left: {style:'thin', color: {argb:'00ffffff'}},
            bottom: {style:'thin', color: {argb: i === lowerBottomRow + 2 ? '00000000' : '00ffffff'}}
          }

          if(key !== headerArr.length - 1){
            borderStyle.right = {style:'thin', color: {argb: '00ffffff'}}
          }

          worksheet.getRow(i).getCell(key + 1).border = borderStyle;
        })

        if(i === lowerBottomRow + 2){
          worksheet.mergeCells(`A${i+1}:B${i+1}`);
          worksheet.getRow(i+1).getCell('A').value = 'Supplier Representative';
          worksheet.getRow(i+1).getCell('A').alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
          worksheet.mergeCells(`C${i+1}:D${i+1}`);
          worksheet.getRow(i+1).getCell('C').value = 'Plate Number';
          worksheet.getRow(i+1).getCell('C').alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
          worksheet.mergeCells(`E${i+1}:F${i+1}`);
          worksheet.getRow(i+1).getCell('E').value = 'Date';
          worksheet.getRow(i+1).getCell('E').alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
        }
      }

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        const link= window.URL.createObjectURL(blob);
        let aDom = document.createElement('a')
        aDom.type = 'download'
        aDom.href = link
        aDom.download = `${excelName}.xlsx`
        aDom.click()
      })
    }
  }
  
  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (itemQuery) {
      handleSearchItems()
    } else if (!itemQuery) {
      setSearchedItem(warehouseSKUs)
    }
    return handleSearchItems.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [itemQuery]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searchedItem) {
      setSKU(searchedItem);
    }
  }, [searchedItem]);

  const handleAddItems = () => {
    setOpenAddItems(false);
    setSelectedSKU(items);
  }

  const prevOpen = React.useRef(openAddItems);

  React.useEffect(() => {
    if (prevOpen.current === true && openAddItems === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openAddItems;
  }, [openAddItems]);
  

  // Hook Form
  const { errors, control, getValues, setError, clearErrors, setValue } = useForm({
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

  // Set query state on input change
  const handleItemSearch = (e) => {
    setSearchedItem(null);
    setItemQuery(e.target.value);
  }

  // Handle Search input
  const handleInputChange = (event) => {
    onInputChange(event);
    setPage(0);
  }

  const handleSave = data => {
    const values = getValues([
      `actualQty${data.delivery_notice_item}`,
      `cbm${data.delivery_notice_item}`,
      `discrepancy${data.delivery_notice_item}`,
      `damage${data.delivery_notice_item}`,
      `date${data.delivery_notice_item}`,
      `inspectedBy${data.delivery_notice_item}`,
      `notes${data.delivery_notice_item}`
    ]);

    const rowData = {
      received_id: props.receivingData.recieved_id,
      item_code: data.item_code,
      actual_quantity: Number(values[`actualQty${data.delivery_notice_item}`]),
      cbm: Number(values[`cbm${data.delivery_notice_item}`]),
      discrepancy: Number(values[`discrepancy${data.delivery_notice_item}`]),
      damage: Number(values[`damage${data.delivery_notice_item}`]),
      arrival_datetime: values[`date${data.delivery_notice_item}`],
      inspected_by: values[`inspectedBy${data.delivery_notice_item}`],
      notes: values[`notes${data.delivery_notice_item}`],
    }

    if (!rowData.arrival_datetime) {
      setError(`date`, {
        type: "date",
        message: "Arrived Date is Reuired",
      });
    }

    if (!rowData.inspected_by) {
      setError(`inspected_by`, {
        type: "inspected_by",
        message: "Inspected by is Reuired",
      });
    }

    if (_.isEmpty(errors)) {
      props.onSubmit(rowData, data.delivery_notice_item);
    } else {
      props.onError(errors);
    }

    clearErrors(["inspected_by", "date"]);
  }

  // Setter for table data
  React.useEffect(() => {
    if (props.submittedId) {
      const filteredCheck = isChecked.filter(check => check !== props.submittedId);
      const filteredItem = items.filter(sku => sku.delivery_notice_item !== props.submittedId);
      setIsChecked(filteredCheck);
      setSelectedSKU(filteredItem);
      setItems(filteredItem);
    } 
  }, [props.submittedId]);

  // Setter for table data
  React.useEffect(() => {
    setTableData(selectedSKU);
    if (selectedSKU.length) {
      setAddMode(true);
    } else {
      setTableData(receivingItem)
      setAddMode(false)
    }
  }, [selectedSKU, receivingItem]);
  
  /**
   * Call delayedQuery function when user search and set new sku data
   */
   React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else if (!query) {
      setDeliveryNoticeData(props.notice);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query, delayedQuery, page, rowCount, rowsPerPage]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice) {
      setDeliveryNoticeData(props.notice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  React.useEffect(() => { 
    if (JSON.stringify(deliveryNoticeData) === '{}') {
      setOpenBackdrop(false);
    }
  }, [deliveryNoticeData]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.receivingData) {
      props.fetchReceivingItem({
        received_id: props.receivingData.recieved_id,
        count: page || 10,
        after: page * rowCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.receivingData]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.item) {
      if (Array.isArray(props.item.data)) {
        if (props.item.data.length) {
          setReceivingItem(props.item.data);
          setItemCount(props.item.count);
          cookie.set('total_print_table',props.item.count);
          setOpenBackdrop(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.item]);

  // Set delivery notice count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.notice) {
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setTableData(searched)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  React.useEffect(() => {
    if (props.deliveryNoticeId && !SKU.length) {
      if (!itemQuery) {
        fetchAllDeliveryNoticeSKU(props.deliveryNoticeId)
        .then(response => {
          setSKU(response.data);
          setwarehouseSKUs(response.data);
          setOpenBackdrop(false)
        })
        .catch(error => {
          dispatchError(dispatch, THROW_ERROR, error);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.deliveryNoticeId]);

  React.useEffect(() => {
    if (deliveryNoticeData) {
      setOpenBackdrop(true)
      props.fetchDeliveryNoticeSKU({delivery_notice_id: deliveryNoticeData.delivery_notice_id});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [deliveryNoticeData]);

  React.useEffect(() => {
    if (!selectedSKU.length && deliveryNoticeData) {
      props.fetchDeliveryNoticeSKU({delivery_notice_id: deliveryNoticeData.delivery_notice_id});
      setOpenBackdrop(true);
    }
    if (!selectedSKU.length) {
      setOpenBackdrop(true);
      props.fetchReceivingItem({
        received_id: props.receivingData.recieved_id,
        count: rowsPerPage,
        after: page * rowCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedSKU]);

  React.useEffect(() => {
    if (props.sku) {
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku]);

  React.useEffect(() => {
    if (props.warehouse) fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.warehouse]);

  const getTableHead = (header) => {
    if ((header === 'Actual Arrived Date' || header === 'Inspected by') && addMode) {
      return <>{header} 
        <Tooltip title="Apply to All"  sx={{ ml: 1, my: -0.6 }}>
          <IconButton onClick={() => onApplyAll(header === 'Inspected by' ? 'inspectedBy' : 'date')}>
            <PlaylistAddCheckIcon color="success"/>
          </IconButton>
        </Tooltip>
      </>
    } else if ((header === 'Actual Pull Out Date' && receivingData.transaction_type === 'Inbound') && !addMode) {
      return 'Actual Receiving Date';
    } else return header;
  }

  const onApplyAll = (type) => {
    const id = Object.values(tableData)[0].delivery_notice_item;
    const value = getValues(type + id);
    tableData.forEach((item, i) => {
      setValue(`${type}${item.delivery_notice_item}`,value)
    });
  }

  return (
    <React.Fragment>
      <div className={classes.toolbar}>
        <Button ref={anchorRef} aria-haspopup="true" onClick={handleToggle} variant="contained" className="btn btn--emerald receiving-add-item-btn" disableElevation endIcon={<ArrowDropDownIcon />}>Add Items</Button>
        <Popper
          className="items-popover"
          open={openAddItems}
          anchorEl={anchorRef.current}
          transition
          disablePortal
          placement='bottom-end'
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
              <Paper>
                <TextField
                  className="sku-search-items"
                  variant="outlined"
                  type="text" 
                  value={itemQuery}
                  required
                  fullWidth
                  placeholder="Search"
                  onChange={handleItemSearch}
                />
                <MenuList autoFocusItem={openAddItems} id="menu-list-grow" onKeyDown={handleListKeyDown}> 
                  {SKU.length ?
                    <MenuItem value="all" onClick={checkAll}>
                      <Checkbox
                        checked={isAllSelected}
                        sx={{
                          '&.Mui-checked': {
                            color: '#009688',
                          },
                        }}
                      />
                      <ListItemText primary="Select All"/>
                    </MenuItem> : null
                  }
                  {SKU.map((item) => (
                    <MenuItem key={item.delivery_notice_item} value={item.external_material_description} onClick={() => toggleCheckboxValue(item, isChecked.includes(item.delivery_notice_item))} >
                      <Checkbox
                        checked={isChecked.includes(item.delivery_notice_item)} 
                        sx={{
                          '&.Mui-checked': {
                            color: '#009688',
                          },
                        }}
                      />
                      <ListItemText primary={item.external_material_description} />
                    </MenuItem>
                  ))}
                </MenuList>
                <hr />
                <Button variant="contained" className="btn btn--emerald" onClick={handleAddItems} disableElevation>Done</Button>
              </Paper>
            </Grow>
          )}
        </Popper>
        <div className={classes.filter}>
          <FormControl className="search_form receiving-items-search">
            <OutlinedInput
              style={{backgroundColor: '#E9E9E9'}}
              variant="standard"
              placeholder="Search"
              value={query}
              fullWidth
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
          <div>
            <ReactToPrint
              trigger={() => {
                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                // to the root node of the returned component as it will be overwritten.
                return <Button variant="contained" className="btn btn--emerald receiving-add-item-btn" disableElevation style={{marginLeft: 15}}>Print</Button>;
              }}
              content={() => printComponent.current}
            />
            <PrintableForms ref={printComponent} count={itemCount}/>
          </div>
          <Button variant="contained" className="btn btn--emerald receiving-add-item-btn" disableElevation onClick={handleDownloadPrintableFormAsExcel} disabled={itemCount === 0} style={{width: '33%'}} endIcon={disableExcelbtn && <CircularProgress size={15} style={{color: '#fff'}}/>}>
            Excel
          </Button>
        </div>
        <div className={classes.pagination}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={Number(itemCount)}
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
                  <TableCell align={config.headers[index] ? config.headers[index].align : 'left'} key={header}>{getTableHead(header)}</TableCell>
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
                <TableRow key={data.delivery_notice_item ? data.delivery_notice_item : i} className="table__row sku-table">
                  <TableCell
                    key={i}
                    title={data.item_code}
                    style={{
                      maxWidth: '180px',
                      overflowX: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{data.item_code}
                  </TableCell>
                  <TableCell>{!addMode ? data.expected_quantity : data.expected_qty}</TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`actualQty${data.delivery_notice_item}`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        defaultValue={0}
                        as={<TextField variant="outlined" type="number" InputProps={{ inputProps: { min: 0 }}} className="actual-quantity" required fullWidth/>}
                      /> : data.actual_quantity
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`cbm${data.delivery_notice_item}`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        defaultValue={0}
                        as={<TextField variant="outlined" type="number" InputProps={{ inputProps: { min: 0 }}} required/>}
                      /> : data.cbm
                    }
                  </TableCell>
                  <TableCell>
                    { !addMode ? data.uom_type : data.uom }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`discrepancy${data.delivery_notice_item}`}
                        control={control}
                        rules={{ 
                          required: "This field is required",
                          validate: value => { return value < 0 ? 'Invalid value' : true } 
                        }}
                        defaultValue={0}
                        InputProps={{ inputProps: { min: 0 }}} 
                        as={<TextField variant="outlined" type="number" className="discrepancy" required fullWidth/>}
                      /> : data.discrepancy
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`damage${data.delivery_notice_item}`}
                        control={control} 
                        rules={{ 
                          required: "This field is required",
                          validate: value => { return value < 0 ? 'Invalid value' : true } 
                        }}
                        InputProps={{ inputProps: { min: 0 }}}
                        defaultValue={0}
                        as={<TextField variant="outlined" required type="number" required fullWidth/>}
                      /> : data.damaged
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ?
                      <Controller 
                        name={`date${data.delivery_notice_item}`}
                        control={control}
                        rules={{ 
                          required: "This field is required"
                        }}
                        defaultValue={''}
                        as={
                          <TextField
                            variant="outlined"
                            type="date"
                            required
                            fullWidth
                          />
                        }
                      /> :
                      moment(data.actual_arrived_date_time).format('MM-DD-YYYY')
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`inspectedBy${data.delivery_notice_item}`}
                        control={control}
                        defaultValue={''}
                        rules={{ required: "This field is required" }}
                        as={<TextField variant="outlined" type="text" required className="notes" fullWidth id={'inspected_by' + i}/>}
                      /> :
                      data.inspected
                    }
                  </TableCell>
                  <TableCell>
                    {addMode ? 
                      <Controller
                        name={`notes${data.delivery_notice_item}`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        defaultValue={data.notes ? data.notes : "None"}
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
      <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
    </React.Fragment>
  );
}

/**
 * Redux states to component props
 */
 const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    searched: state.receiving_releasing.searchItem,
    sku: state.notice.sku,
    item: state.receiving_releasing.receivingItem
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchReceivingItem, searchReceivingAndReleasingItem, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU })(Table_);
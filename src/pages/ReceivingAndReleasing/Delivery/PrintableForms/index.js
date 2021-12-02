import React from 'react';
import { Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import formIcon from '../../../../assets/img/tmpLogo.png';
import '../PrintableForms/style.scss';
import Cookie from 'universal-cookie';
import inteluck from 'api/inteluck';
import moment from 'moment';

const cookie = new Cookie();
// the react-to-print package only support class components to print
class PrintableForms extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: cookie.get('rowReceiveingReleasing'),
            tableData: [],
            rowCount: this.props.count || 0
        };

        this.getTableData = this.getTableData.bind(this);
    }

    componentDidMount(){
        // initial call of the table
        this.getTableData();
    }

    componentDidUpdate(){
        if(this.props.count !== this.state.rowCount){
            console.info('count changed')
            this.setState({rowCount: this.props.count},() => {
                this.getTableData();
            })
        }
    }

    getTableData(){
        const dataObj = {
            received_id: this.state.data.recieved_id,
            count: this.state.rowCount,
            after: 0,
        }

        // get the table data
        inteluck.get(`/v1/wms/Warehouse/Delivery/Received_Item`, { params: dataObj })
        .then(response => {
            const resData = response.data;
            console.log(resData)

            // format array
            // const arr = [{page: 1, rows: []}, {page: n, rows: []}];
            const arr = [];
            let page = 1;
            resData.forEach((item, n) => {
                const rowNum = n + 1;
                item.rowNum = rowNum;
                const ifPageExists = arr.find(n => n.page === page);                
                if(ifPageExists){
                    if(ifPageExists.rows.length < 10){
                        ifPageExists.rows.push(item);
                    }else{
                        page = page + 1;
                        arr.push({
                            page,
                            rows: [item]
                        })
                    }
                }else{
                    arr.push({
                        page,
                        rows: [item]
                    })
                }
            })

            this.setState({tableData: arr});
        }).catch(error => {
            console.info(error);
        });
    }

    render() {
      return (
        <div id="formToPrint" className='print-source' style={{margin: "0", padding: "0"}}>
            {
                this.state.tableData.map(item => (
                    <div style={{height: "100%", position: 'relative'}} key={item.page}>
                        <div className={`top-border ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green' : 'orange'}`} />
                        <Grid container style={{padding: '0px 30px'}}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} className="align-center justify-space-between">
                                        <div style={{display: 'flex', alignContent: 'center'}}>
                                            <div className={`form-title-left-line ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green' : 'orange'}`}/>
                                            <label className={`form-title ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green-color' : 'orange-color'}`}>
                                                {
                                                    this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'Receiving Report' : 'Withdrawal Slip'
                                                }
                                            </label>
                                        </div>
                                        <img src={formIcon} alt="" className="form-logo"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '20px 30px 10px 30px'}}>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12} className="align-center row details-cont left">
                                        <label>{this.state.data.client_name}</label>
                                        <label>Client</label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont left">
                                        <label>{this.state.data.shipper_name}</label>
                                        <label>Shipper</label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont left">
                                        <label>{this.state.data.transaction_type}</label>
                                        <label>Transaction type</label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont left">
                                        <label>{this.state.data.warehouse_name}</label>
                                        <label>Location</label>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12} className="align-center row details-cont right">
                                        <label>{this.state.data.unique_code}</label>
                                        <label>
                                            {
                                                this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'Receiving Report Number' : 'Withdrawal Slip Number'
                                            }
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont right">
                                        <label>{moment(new Date(this.state.data.datetime)).format('LL')}</label>
                                        <label>Date</label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont right">
                                        <label>{this.state.data.reference_number}</label>
                                        <label>Reference Number</label>
                                    </Grid>
                                    <Grid item xs={12} className="align-center row details-cont right">
                                        <label>{`${item.page} of ${this.state.tableData.length}`}</label>
                                        <label>Page</label>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '0px 30px 0px 30px'}}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tbl-cell header">ITEM #</TableCell>
                                            <TableCell className="tbl-cell header">DESCRIPTION</TableCell>
                                            <TableCell className="tbl-cell header">CODE</TableCell>
                                            <TableCell className="tbl-cell header">QTY</TableCell>
                                            <TableCell className="tbl-cell header">UNIT</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            item.rows.map(rowItem => (
                                                <TableRow key={rowItem.rowNum}>
                                                    <TableCell className="tbl-cell">{rowItem.rowNum}</TableCell>
                                                    <TableCell className="tbl-cell">{rowItem.product_name}</TableCell>
                                                    <TableCell className="tbl-cell">{rowItem.item_code}</TableCell>
                                                    <TableCell className="tbl-cell">{rowItem.actual_quantity}</TableCell>
                                                    <TableCell className="tbl-cell">{rowItem.uom_type}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <div className="bottom-section">
                            <Grid container spacing={1} style={{padding: '20px 30px 15px 30px'}}>
                                <Grid item xs={12} className="align-center row details-cont left">
                                    <label>Remarks</label>
                                    <div></div>
                                </Grid>
                            </Grid>
                            <div className="broken-line"/>
                            <Grid container spacing={1} style={{padding: '30px', paddingTop: '15px'}}>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={12} className="align-center row details-cont left" style={{paddingRight: '30%'}}>
                                            <label>Received and Checked by</label>
                                            <div></div>
                                            <span>Warehouse Assistant</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={12} className="align-center row details-cont left" style={{paddingLeft: '30%'}}>
                                            <label>Noted by</label>
                                            <div></div>
                                            <span>Supervisor / Manager</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={4} className="align-center row details-cont left">
                                            <label>{this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'Delivered by' : 'Received by'}</label>
                                            <div></div>
                                            <span>Supplier Representative</span>
                                        </Grid>
                                        <Grid item xs={4} className="align-center row details-cont left">
                                            <label></label>
                                            <div></div>
                                            <span>Plate Number</span>
                                        </Grid>
                                        <Grid item xs={4} className="align-center row details-cont left">
                                            <label></label>
                                            <div></div>
                                            <span>Date</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                ))
            }
        </div>
      );
    }
  }

export default PrintableForms;
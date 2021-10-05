import React from 'react';
import { Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import formIcon from '../../../../assets/img/tmpLogo.png';
import '../PrintableForms/style.scss';
import history from 'config/history';
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
            this.setState({tableData: response.data});
        }).catch(error => {
            console.info(error);
        });
    }

    render() {
      return (
        <div id="formToPrint" className='print-source'>
            <div className={`top-border ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green' : 'orange'}`} />
            <Grid container spacing={1} style={{marginTop: '15px', padding: '30px', paddingTop: '40px'}}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6} className="align-center">
                            <div className={`form-title-left-line ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green' : 'orange'}`}/>
                            <label className={`form-title ${this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'green-color' : 'orange-color'}`}>
                                {
                                    this.state.data.transaction_type && this.state.data.transaction_type === 'Inbound' ? 'Receiving Report' : 'Withdrawal Slip'
                                }
                            </label>
                        </Grid>
                        <Grid item xs={6}>
                            <img src={formIcon} alt="" className="form-logo"/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{padding: '30px'}}>
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
                            <label>Receiving Report Number</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont right">
                            <label>{moment(new Date(this.state.data.datetime)).format('LL')}</label>
                            <label>Date</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont right">
                            <label>{this.state.data.reference_number}</label>
                            <label>Reference Number</label>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{padding: '0px 30px 30px 30px'}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{background: 'rgba(0, 0, 0, 0.04)'}}>
                                <TableCell>ITEM #</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>CODE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>UNIT</TableCell>
                                <TableCell>EXP DATE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.tableData.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell>{key + 1}</TableCell>
                                        <TableCell>{item.product_name}</TableCell>
                                        <TableCell>{item.external_code}</TableCell>
                                        <TableCell>{item.actual_quantity}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell>{moment(new Date(item.actual_arrived_date_time)).format('L')}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid container spacing={1} style={{padding: '50px 30px 30px 30px'}}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} className="align-center row details-cont left">
                            <label>Remarks</label>
                            <div></div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div className={this.state.tableData.length < 10 ? "bottom-section" : ""}>
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
      );
    }
  }

export default PrintableForms;
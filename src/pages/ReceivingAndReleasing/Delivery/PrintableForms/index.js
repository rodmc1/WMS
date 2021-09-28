import React from 'react';
import { Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import formIcon from '../../../../assets/img/tmpLogo.png';
import '../PrintableForms/style.scss';
import history from 'config/history';
import Cookie from 'universal-cookie';

const cookie = new Cookie();
// the react-to-print package only support class components to print
class PrintableForms extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount(){
        this.setState({data: cookie.get('rowReceiveingReleasing')})
        console.info(cookie.get('rowReceiveingReleasing'));
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
                            <label>WUHAN FIBERHOME INT. TECH. PHILS. INC.</label>
                            <label>Client</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont left">
                            <label>WUHAN FIBERHOME INT. TECH. PHILS. INC.</label>
                            <label>Shipper</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont left">
                            <label>Delivery</label>
                            <label>Mode of Entry</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont left">
                            <label>1035-Inteluck-COD</label>
                            <label>Location</label>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={12} className="align-center row details-cont right">
                            <label>RR20210908001</label>
                            <label>Receiving Report Number</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont right">
                            <label>September 1, 2021</label>
                            <label>Date</label>
                        </Grid>
                        <Grid item xs={12} className="align-center row details-cont right">
                            <label>FHSQ-20210908-0001</label>
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
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>CODE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>UNIT</TableCell>
                                <TableCell>EXP DATE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>2</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>CODE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>UNIT</TableCell>
                                <TableCell>EXP DATE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>3</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>CODE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>UNIT</TableCell>
                                <TableCell>EXP DATE</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>4</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>CODE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>UNIT</TableCell>
                                <TableCell>EXP DATE</TableCell>
                            </TableRow>
                            {/* <TableRow>
                                <TableCell>5</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>6</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>7</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>8</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>9</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow> */}
                            {/* <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>10</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                                <TableCell>--</TableCell>
                            </TableRow> */}
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
            <div className="bottom-section">
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
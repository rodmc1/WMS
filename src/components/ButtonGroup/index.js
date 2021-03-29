import './style.scss';
import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MuiButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

function ButtonGroup(props) {
  const [color, setColor] = useState({available: 'white', notavailable: '#828282'});
  const { data, handleSelectedFacilities } = props;

  React.useEffect(() => {
    if (props.warehouseFacilitiesAndAmenities) {
      if (props.warehouseFacilitiesAndAmenities.facilities_amenities.includes(data.Description)) {
        setColor({available: '#009688', notavailable: '#FAFAFA'});
      }
    }
  }, [props.warehouseFacilitiesAndAmenities]);
  
  /*  
   * Switch color via color state
   * @args Selected Facilities and Amenities 
   * @CB Handle selected Facilities and Amenities
   */ 
  const onButtonClick = (status) => {
    handleSelectedFacilities(data.Description, status);
    setColor({available: '#009688', notavailable: '#FAFAFA'});
    if (!status) {
      setColor({available: '#FAFAFA', notavailable: '#828282'});
    }
  }

  return (
    <Grid item xs={12} md={4} key={data.Id}>
      <Typography>{data.Description}</Typography>
      <MuiButtonGroup>
        <Button
          style={{backgroundColor: color.available }}
          variant="outlined"
          onClick={() => onButtonClick(true)}>
          Available
        </Button>
        <Button 
          style={{backgroundColor: color.notavailable }}
          variant="outlined"
          onClick={() => onButtonClick(false)}>
          Not Available
        </Button>
      </MuiButtonGroup>
    </Grid>
  )
}

export default ButtonGroup;
import './style.scss';
import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MuiButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

function ButtonGroup(props) {
  const btnColor = {
    white: '#FAFAFA',
    grey: '#828282',
    lightgrey: '#E9E9E9',
    emerald: '#009688'
  }
  const [color, setColor] = useState({ available: btnColor.white, notavailable: btnColor.grey });

  React.useEffect(() => {
    if (props.warehouseFacilitiesAndAmenities) {
      if (props.warehouseFacilitiesAndAmenities.includes(props.data.Description)) {
        setColor({ 
          available: btnColor.emerald,
          notavailable: btnColor.white,
          textColorAvailabe: btnColor.lightgrey,
          textColorNotAvailabe: btnColor.grey
        });
      } else {
        setColor({ 
          available: btnColor.white,
          notavailable: btnColor.grey,
          textColorAvailabe: btnColor.grey,
          textColorNotAvailabe: btnColor.lightgrey });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.warehouseFacilitiesAndAmenities]);
  
  const onButtonClick = (status) => {
    props.handleSelectedFacilities(props.data.Description, status);

    if (!status) {
      setColor({ 
        available: btnColor.white,
        notavailable: btnColor.lightgrey,
        textColorAvailabe: btnColor.grey,
        textColorNotAvailabe: btnColor.lightgrey
      });
    } else {
      setColor({ 
        available: btnColor.emerald,
        notavailable: btnColor.white,
        textColorAvailabe: btnColor.lightgrey,
        textColorNotAvailabe: btnColor.grey
      });
    }
  }

  return (
    <Grid item xs={12} md={4} key={props.data.Id}>
      <Typography>{props.data.Description}</Typography>
      <MuiButtonGroup>
        <Button
          style={{backgroundColor: color.available, color: color.textColorAvailabe }}
          variant="outlined"
          onClick={() => onButtonClick(true)}>
          Available
        </Button>
        <Button 
          style={{backgroundColor: color.notavailable, color: color.textColorNotAvailabe }}
          variant="outlined"
          onClick={() => onButtonClick(false)}>
          Not Available
        </Button>
      </MuiButtonGroup>
    </Grid>
  )
}

export default ButtonGroup;
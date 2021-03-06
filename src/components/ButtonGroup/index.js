import './style.scss';
import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiButtonGroup from '@material-ui/core/ButtonGroup';

// default colors for buttons, add if needed
const btnColor = {
  white: '#FAFAFA',
  grey: '#828282',
  lightgrey: '#E9E9E9',
  emerald: '#009688'
}

/*
 * Handles button actions and set colors via status
 * @args props {data, picklist, picklistAction}
 */
function ButtonGroup(props) {
  const [color, setColor] = useState({ available: btnColor.white, notavailable: btnColor.grey });
  
  // Handles button color change whenever a props changes
  React.useEffect(() => {
    if (props.picklist) {
      if (props.picklist.includes(props.data.Description)) {
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
  }, [props.picklist]);
  
  /*
   * Calls picklistAction function on button click
   * Returns picklist description and status 
   * Set new colors to buttons based on the status value
   * @args status (boolean)
   */
  const onButtonClick = (status) => {
    props.picklistAction(props.data.Description, status);

    if (!status) {
      setColor({ 
        available: btnColor.white,
        notavailable: btnColor.grey,
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
          style={{ backgroundColor: color.available, color: color.textColorAvailabe }}
          variant="outlined"
          onClick={() => onButtonClick(true)}>
          Available
        </Button>
        <Button 
          style={{ backgroundColor: color.notavailable, color: color.textColorNotAvailabe }}
          variant="outlined"
          onClick={() => onButtonClick(false)}>
          Not Available
        </Button>
      </MuiButtonGroup>
    </Grid>
  )
}

export default ButtonGroup;
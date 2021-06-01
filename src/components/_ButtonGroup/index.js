import React from 'react';

function ButtonGroup ({ labels, values, field }) {
  return (
    // <div>
    //   <label>{labels[0]}</label>
      <input {...field} type="radio" value={values[0]} />
    // </div>
  )
}

export default ButtonGroup;
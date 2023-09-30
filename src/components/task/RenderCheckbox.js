import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

export default function RenderCheckbox({
  id,
  name,
  disabled,
  checked,
  onChange,
}) {
  return (
    <>
      {/* {edit ? ( */}
      {/* <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={name}
            checked={checked}
            name='checked'
            color='primary'
            disabled={disabled}
            onChange={(e) => {
              setEdit(false);
              onChange(id, { [e.target.name]: e.target.checked });
            }}
          />
        }
        label={name}
      /> */}
      <Typography variant='body1'>{name}</Typography>
      {/* ) : (
         <div>
           {!disabled && ( 
             // <IconButton onClick={() => setEdit(true)}>
             <Edit
               color="primary"
               fontSize="small"
               onClick={() => setEdit(true)}
             />
             // </IconButton>
           )}
           {name}
           <Done color={checked ? 'primary' : 'default'} fontSize="small" />
         </div>
       )}*/}
    </>
  );
}

RenderCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

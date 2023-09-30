import React, { useState } from 'react';
import './Questions.css';
import { TextField } from '@material-ui/core';

const Questions = ({ slices, changeQuestion, selectScore }) => {
  const [open, setOpen] = useState(false);

  let questions = Object.keys(slices).map((questionKey, i) => (
    <li key={i}>
      {open && (
        <TextField
          // variant='outlined'
          size='small'
          placeholder='Enter milestone...'
          defaultValue={slices[questionKey].question}
          // onClick={() => setOpen(false)}
          // onChange={changeQuestion(questionKey)}
          onBlur={
            changeQuestion(questionKey)
            // setOpen(false);
          }
        />
      )}
      {!open && !slices[questionKey].question && (
        <TextField
          // variant='outlined'
          size='small'
          placeholder='Enter milestone...'
          defaultValue={slices[questionKey].question}
          onClick={() => setOpen(false)}
          // onChange={changeQuestion(questionKey)}
          onBlur={
            changeQuestion(questionKey)
            // setOpen(true);
          }
        />
      )}
      {!open && slices[questionKey].question && (
        <div onClick={() => setOpen(true)}>
          <p>{slices[questionKey].question}</p>
        </div>
      )}
      <div className='Answer'>
        <input
          onChange={selectScore(questionKey)}
          type='range'
          min='1'
          max='10'
          value={
            slices[questionKey].transform === '1'
              ? '10'
              : slices[questionKey].transform.replace('0.', '')
          }
          className='rangeInput'
          style={{ background: slices[questionKey].fill }}
        />
        <span
          className='Score'
          style={{ backgroundColor: slices[questionKey].fill }}>
          <div
            className='leftArrow'
            style={{
              borderRight: '5px solid ' + slices[questionKey].fill,
            }}></div>
          {slices[questionKey].transform === '1'
            ? '10'
            : slices[questionKey].transform.replace('0.', '')}
        </span>
      </div>
    </li>
  ));

  return <>{questions}</>;
};

export default Questions;

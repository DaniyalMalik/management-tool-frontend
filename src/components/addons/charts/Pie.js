import React, { useState, useEffect } from 'react';
import './Pie.css';
import Slice from './Slices/Slices';
import Questions from './Questions/Questions';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePieChart,
  getPieChart,
} from '../../../actions/actionCreators/pieChartActions';
import { updateCardByIdPut } from '../../../actions/actionCreators/cardActions';
import { Button, Typography } from '@material-ui/core';
import { openSnackbar } from '../../../actions/actionCreators/snackbarActions';
import {
  openLoader,
  closeLoader,
} from '../../../actions/actionCreators/loaderActions';

export const Pie = ({ card, componentUpdated }) => {
  const [state, setState] = useState({
    slices: [
      {
        question: '',
        rotate: 'rotate(0.0000, 220, 220)',
        fill: '#FF5C00',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(45.0000, 220, 220)',
        fill: '#9245FF',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(90.0000, 220, 220)',
        fill: '#FF234B',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(135.0000, 220, 220)',
        fill: '#357AFF',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(180.0000, 220, 220)',
        fill: '#E5AC00',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(225.0000, 220, 220)',
        fill: '#00AB3A',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(270.0000, 220, 220)',
        fill: '#00A9B5',
        transform: '0.1',
      },
      {
        question: '',
        rotate: 'rotate(315.0000, 220, 220)',
        fill: '#E5AC00',
        transform: '0.1',
      },
    ],
  });
  const { slices } = state;
  const dispatch = useDispatch();
  const { pieChart } = useSelector((state) => state.pieCharts);
  const { token } = useSelector((state) => state.user);
  const data = [
    {
      question: '',
      rotate: 'rotate(0.0000, 220, 220)',
      fill: '#FF5C00',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(45.0000, 220, 220)',
      fill: '#9245FF',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(90.0000, 220, 220)',
      fill: '#FF234B',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(135.0000, 220, 220)',
      fill: '#357AFF',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(180.0000, 220, 220)',
      fill: '#E5AC00',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(225.0000, 220, 220)',
      fill: '#00AB3A',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(270.0000, 220, 220)',
      fill: '#00A9B5',
      transform: '0.1',
    },
    {
      question: '',
      rotate: 'rotate(315.0000, 220, 220)',
      fill: '#E5AC00',
      transform: '0.1',
    },
  ];

  const selectScore = (question) => (e) => {
    const targetValue = e.target.value === '10' ? '1' : '0.' + e.target.value;
    const newState = slices;

    newState[question].transform = targetValue;

    setState({ ...state, slices: newState });
  };

  const changeQuestion = (question) => (e) => {
    const targetValue = e.target.value;
    const newState = slices;

    newState[question].question = targetValue;

    setState({ ...state, slices: newState });
  };

  const savePieChart = async (e) => {
    e.preventDefault();

    const res = await dispatch(updatePieChart(card._id, slices, token));

    dispatch(
      openSnackbar({
        open: true,
        message: res?.message,
        severity: res?.success,
      }),
    );
    dispatch(closeLoader());

    if (res?.success && !card?.pieChartId) {
      const res2 = await dispatch(
        updateCardByIdPut(
          card._id,
          { pieChartId: res?.pieChartData?._id },
          token,
        ),
      );

      if (res2?.success) componentUpdated();
    }
  };

  const getResponse = () => {
    dispatch(getPieChart(card._id, token));
  };

  useEffect(() => {
    if (card?._id && token) {
      getResponse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, token]);

  useEffect(() => {
    if (!pieChart?.slices) {
      setState({ ...state, slices: data });
    }

    if (pieChart?.slices) {
      setState({ ...state, slices: pieChart.slices });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieChart]);

  return (
    <>
      <Typography variant='h2' style={{ textAlign: 'center' }}>
        Pie Chart
      </Typography>
      <form onSubmit={savePieChart}>
        <div className='Content' style={{ display: 'flex' }}>
          <div className='QuestionsBlock'>
            <ul>
              <Questions
                key={slices}
                slices={slices}
                selectScore={selectScore}
                changeQuestion={changeQuestion}
              />
            </ul>
          </div>
          <div className='ChartBlock'>
            <div className='ChartPie' style={{ width: '450px' }}>
              <svg
                className='ChartPieChunk'
                width='440px'
                height='440px'
                viewBox='0 0 440 440'
                xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <g id='overlay'>
                    <rect
                      x='219'
                      y='20'
                      height='200'
                      width='2'
                      fill='#FFF'></rect>
                    <g transform='translate(210, 10)'>
                      <path fill='#000'></path>
                    </g>
                  </g>
                </defs>
                <mask id='wedge-mask' fill='white'>
                  <path
                    transform='translate(20, 20)'
                    d='M93 7.241a200.006 200.006 0 01173.551-.865L200.004 200 112.33 20.241z'
                    fillRule='nonzero'></path>
                </mask>
                <circle
                  cx='220'
                  cy='220'
                  r='200'
                  fill='#EFEFEF'
                  stroke='#E3E3E3'
                  strokeWidth='1'></circle>
                <Slice key={slices} slices={slices} />
                <use
                  xlinkHref='#overlay'
                  transform='rotate(108.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(153.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(198.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(243.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(19, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(63.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(108.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(153.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(198.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(243.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(288.7143, 220, 220)'></use>
                <use
                  xlinkHref='#overlay'
                  transform='rotate(333.7143, 220, 220)'></use>
              </svg>
            </div>
          </div>
        </div>
        <Button
          style={{ float: 'right' }}
          color='primary'
          type='submit'
          size='small'
          variant='contained'
          onClick={() => dispatch(openLoader({ open: true }))}>
          Save
        </Button>
      </form>
    </>
  );
};

import React from 'react';
import {Pie, Doughnut} from 'react-chartjs-2';

const state = {

  datasets: [
    {
      label: 'Rainfall',
      backgroundColor: [
        '#FCC653',
        '#ceab65',
        
      ],
      hoverBackgroundColor: [
        '#FCC653',
        '#ceab65',
      
      ],
      data: [60, 49 ]
    }
  ]
}

export default class Dp extends React.Component {
  render() {
    return (
      <div>

        <Doughnut
          data={state}
          options={{
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      </div>
    );
  }
}
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Highcharts from 'highcharts'

function Chart(props) {
  const { company } = useSelector((state) => state.companies)

  useEffect(() => {
    if (props.modules) {
      props.modules.forEach(function (module) {
        module(Highcharts)
      })
    }

    new Highcharts[props.type || 'Chart'](
      props.container,
      props.options,
    )
  }, [company])

  return React.createElement('div', { id: props.container })
}

export default Chart

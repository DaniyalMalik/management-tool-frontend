import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCompany } from '../../actions/actionCreators/companyActions'
import Chart from './Chart'
import './styles.css'

function Main() {
  const { company } = useSelector((state) => state.companies)
  const { token, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const options = {
    chart: {
      type: 'pie',
    },
    series: [
      {
        data: [
          (+company?.left / +company?.budget) * 100,
          (+company?.used / +company?.budget) * 100,
        ],
      },
    ],
  }

  const opts = { container: 'chart', options: options }

  const getResponse = () => {
    if (user?.companyId) {
      dispatch(getCompany(user?.companyId, token))
    } else if (user?.employId) {
      dispatch(getCompany(user?.employId, token))
    }
  }

  useEffect(() => {
    if (token && user) {
      getResponse()
    }
  }, [token, user])

  return (
    <div className="App">
      <Chart {...opts} />
    </div>
  )
}

export default Main

import React, { memo, useContext } from 'react'
import { get } from 'lodash'
import PageContext from '../../../context/PageContext'
import AppContext from '../../../context/AppContext'
import Icons from '../Icons'
import { formatDate } from '../../../components/Utilities'
import * as _ from 'lodash'

const BirthDateC = () => {
  const context = useContext(AppContext)
  const { state } = context
  const { data, theme } = state
  const Icon = get(Icons, 'birthday')

  if (_.get(data, "jsonld['@graph'][1].birthDate", '')) {
    return (
      <div className="text-xs flex items-center">
        <Icon
          size="10px"
          className="mr-2"
          style={{ color: theme.colors.background }}
        />
        <span className="font-medium break-all">
          {formatDate({
            date: _.get(data, "jsonld['@graph'][1].birthDate", ''),
            language: data.language || 'en',
            includeDay: true,
          })}
        </span>
      </div>
    )
  }

  return null
}

export default memo(BirthDateC)

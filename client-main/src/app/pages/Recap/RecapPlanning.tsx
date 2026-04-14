import React, { FC, lazy } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import TablePlanning  from '../../modules/tables/Table-Planning'

const PlanningPage: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Planning</PageTitle>
      <div className='row gy-5 gx-xl-8' >
        <div className='col-xl-8' style={{ width: '100%' }}>
          <TablePlanning />
        </div>
      </div>
    </>
  )
}

export default PlanningPage
import React, { FC, lazy } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import TableConstruct  from '../../modules/tables/Table-Construct'

const ConstructionPage: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Construction</PageTitle>
      <div className='row gy-5 gx-xl-8' >
        <div className='col-xl-8' style={{ width: '100%' }}>
          <TableConstruct />
        </div>
      </div>
    </>
  )
}

export default ConstructionPage
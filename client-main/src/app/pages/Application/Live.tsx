import React, { FC, lazy } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import TableGoLive from '../../modules/tables/Table-Golive'

const Live: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Go Live</PageTitle>
      <div className='row gy-5 gx-xl-8' >
        <div className='col-xl-8' style={{ width: '100%' }}>
          <TableGoLive />
        </div>
      </div>
    </>
  )
}

export default Live
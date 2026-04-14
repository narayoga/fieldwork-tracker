import React, { FC, lazy } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import TableMitra from '../../modules/tables/Table-Mitra'

const Mitra: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Mitra</PageTitle>
      <div className='row gy-5 gx-xl-8' >
        <div className='col-xl-8' style={{ width: '100%' }}>
          <TableMitra />
        </div>
      </div>
    </>
  )
}

export default Mitra
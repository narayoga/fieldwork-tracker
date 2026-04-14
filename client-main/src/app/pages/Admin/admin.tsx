import React, { FC, lazy } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import TableAdmin from '../../modules/tables/Table-Admin'

const Admin: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Admin</PageTitle>
      <div className='row gy-5 gx-xl-8' >
        <div className='col-xl-8' style={{ width: '100%' }}>
          <TableAdmin />
        </div>
      </div>
    </>
  )
}

export default Admin
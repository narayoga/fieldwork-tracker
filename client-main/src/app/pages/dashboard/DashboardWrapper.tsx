/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  TablesPlan,
  TablesConstruction,
} from '../../../_metronic/partials/widgets'

const DashboardPage: FC = () => (
  <>
    <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-4' style={{ width: '100%' }}>
        {/* <UsersListWrapper /> */}
        <TablesPlan className='card-xxl-stretch mb-5 mb-xl-8' />
        <TablesConstruction className='card-xxl-stretch mb-5 mb-xl-8' />
        {/* <div className='col-xl-8'>
          <TablesWidget14 className='card-xxl-stretch mb-5 mb-xl-8' />
        </div> */}
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }

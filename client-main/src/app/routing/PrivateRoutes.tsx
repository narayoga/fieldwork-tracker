import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'

const PrivateRoutes = () => {
  const Construction = lazy(() => import('../pages/Recap/RecapConstruction'))
  const Planning = lazy(() => import('../pages/Recap/RecapPlanning'))
  const Live = lazy(() => import('../pages/Application/Live'))
  const Mitra = lazy(() => import('../pages/Application/Mitra'))
  const Admin = lazy(() => import('../pages/Admin/admin'))
  const Test = lazy(() => import('../modules/tables/tes'))
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='*' element={<Navigate to='/error/404' />} />
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route
          path='planning'
          element={
            <SuspensedView>
              <Planning />
            </SuspensedView>
          }
        />
        <Route
          path='construction'
          element={
            <SuspensedView>
              <Construction />
            </SuspensedView>
          }
        />
        <Route
          path='live'
          element={
            <SuspensedView>
              <Live />
            </SuspensedView>
          }
        />
        <Route
          path='mitra'
          element={
            <SuspensedView>
              <Mitra />
            </SuspensedView>
          }
        />
        <Route
          path='admin'
          element={
            <SuspensedView>
              <Admin />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}

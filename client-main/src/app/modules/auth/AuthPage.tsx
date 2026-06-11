/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import './components/auth-login.css'

const AuthLayout = () => {
  useEffect(() => {
    document.body.style.background = '#f5f8fa'
    return () => {
      document.body.style.background = ''
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <div className='crm-login-card animate__animated animate__fadeInUp animate__faster'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}

/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../app/modules/auth'
import { Languages } from './Languages'
import { toAbsoluteUrl } from '../../../helpers'
import { AppsContext } from '../../../../app/routing/AppRoutes'

const HeaderUserMenu = () => {
  const navigate = useNavigate()
  // const apps  = useContext(AppsContext);
  const user = JSON.parse(localStorage.getItem('auth')) 
  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  // useEffect(() => {
  //   console.log(apps.apps.username)
  // },[])

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('/media/avatars/blank.png')} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {user.username}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {user.role}
            </a>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {user.handphone}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5 text-danger'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }

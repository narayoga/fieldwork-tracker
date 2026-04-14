/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../helpers'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()
  const role = localStorage.getItem('code8uhx9')

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Recap</span>
        </div>
      </div>
      <AsideMenuItem
        to='/planning'
        title='Planning'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/layouts/lay009.svg'
      />
      <AsideMenuItem
        to='/construction'
        title='Construction'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/coding/cod001.svg'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>

      <AsideMenuItem
        to='/live'
        title='ODP Go Live'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      />
      <AsideMenuItem
        to='/mitra'
        icon='/media/icons/duotune/communication/com006.svg'
        title='Mitra'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      {role === 'cckmdshMhcDluEEWVHNc' &&
        <AsideMenuItem
          to='/admin'
          icon='/media/icons/duotune/general/gen026.svg'
          title='Admin'
          fontIcon='bi-layers'
        />
      }
    </>
  )
}

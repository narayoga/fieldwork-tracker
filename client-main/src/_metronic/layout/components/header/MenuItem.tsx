import React from 'react'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import clsx from 'clsx'
import {checkIsActive, KTSVG} from '../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasArrow?: boolean
  hasBullet?: boolean
}

const MenuItem: React.FC<Props> = ({
  to,
  title,
  icon,
  fontIcon,
  hasArrow = false,
  hasBullet = false,
}) => {
  const {pathname} = useLocation()

  return (
    <div className='menu-item me-lg-1'>
        <h2 className='menu-title'>{title}</h2>
    </div>
  )
}

export {MenuItem}

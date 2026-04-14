/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG } from '../../../helpers'
import json from './json/construct.json'
import axios from 'axios'

type Props = {
  className: string
}

const TablesConstruction: React.FC<Props> = ({ className }, prop) => {
  const token = localStorage.getItem('token')
  const [posts, setPosts] = useState<any>([])
  const [warning, setWarning] = useState<boolean | string>('')
  const title = 'Construction Recap'
  const sto_style = (val: number) => {
    return { verticalAlign: "middle", width: `${val}vw` }
  }
  const getItem = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}dashboard/construction/`;
    await axios.get(url, config)
      .then(res => {
        if (res.data instanceof Array) {
          setPosts(res.data)
          return
        }
        setWarning(true)
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    getItem()
  }, [])
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
          {/* <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 orders</span> */}
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          {/* <button
            type='button'
            className='px-4 btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
            style={{ width: 'fit-content' }}
            disabled
          >
            download
          </button> */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table id="kt_table_users" className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer" role="table">
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-start text-muted text-uppercase'>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>STO</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>Jumlah usulah ODP</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>preparing</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>Construction</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>Closing</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>Aktif</th>
                <th className='text-center' role={"columnheader"} style={sto_style(8)}>Drop</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody className='text-center text-gray-600 fw-bold' role={"rowgroup"}>
              {posts.length === 0 || warning ?
                <tr className='text-center mt-5'>
                  <td colSpan={7}>
                    <div className='text-black font-weight-bold ' style={{ top: "-2px" }}>no match data found</div>
                  </td>
                </tr>
                :
                <></>
              }
              {posts.map((item, i) => {
                return (
                  <tr key={i} role={"row"}>
                    <td role={"cell"} className='text-hover-primary text-center text-dark fw-bold fs-6 cursor-pointer'>
                      {item.sto}
                    </td>
                    <td role={"cell"} className='text-center text-dark fw-bold fs-6'>
                      {item.jumlah_odp}
                    </td>
                    <td role={"cell"} className='text-center text-dark fw-bold fs-6'>
                      {item.preparing}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.construction}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.closing}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.aktif}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.drop}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { TablesConstruction }

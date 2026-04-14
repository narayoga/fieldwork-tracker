/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG } from '../../../helpers'
import planJson from './json/planning.json'
import axios from 'axios'

type Props = {
  className: string
}

const TablesPlan: React.FC<Props> = ({ className }, prop) => {
  const token = localStorage.getItem('token')
  const [posts, setPosts] = useState<any>([])
  const [warning, setWarning] = useState<boolean | string>('')
  const title = 'Planning Recap'
  const sto_style = (val: number) => {
    return { verticalAlign: "middle", width: `${val}vw` }
  }
  const getItem = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}dashboard/planning/`;
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
            style={{width:'fit-content'}}
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
                <th rowSpan={2} className='text-center' role={"columnheader"} style={sto_style(8)}>STO</th>
                <th rowSpan={2} className='min-w-140px text-center' role={"columnheader"} style={{ verticalAlign: "middle" }}>Jumlah LOP</th>
                <th rowSpan={2} className='min-w-120px text-center' role={"columnheader"} style={{ verticalAlign: "middle" }}>Jumlah Usulan ODP</th>
                <th colSpan={3} className='min-w-120px text-center' role={"columnheader"} >Microdemand</th>
                <th colSpan={2} className='min-w-120px text-center' role={"columnheader"} >Status</th>
              </tr>
              <tr className='fw-bolder text-start text-muted text-uppercase'>
                <td className='min-w-120px text-center'>Ongoing</td>
                <td className='min-w-120px text-center'>Rejected</td>
                <td className='min-w-120px text-center'>Approved</td>
                <td className='min-w-120px text-center' style={sto_style(5)}>Go</td>
                <td className='min-w-80px text-center'>No Go</td>
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
              {posts.map((item) => {
                return (
                  <tr key={item.sto}  role={"row"}>
                    <td role={"cell"} className='text-center text-dark fw-bold fs-6'>
                      {item.sto}
                    </td>
                    <td role={"cell"} className='text-center text-dark fw-bold fs-6'>
                      {item.jumlah_lop}
                    </td>
                    <td role={"cell"} className='text-center text-dark fw-bold fs-6'>
                      {item.jumlah_odp}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.ongoing}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.rejected}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.approved}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.status_go}
                    </td>
                    <td className='text-center text-dark fw-bold fs-6' role={"cell"}>
                      {item.status_no_go}
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

export { TablesPlan }

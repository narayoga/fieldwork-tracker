import { useEffect, useState } from 'react'
import axios from 'axios'
import { ModalButtonAdd } from '../../../_metronic/partials/widgets/tables/modal/Planning/Update-Usulan'
import { ModalButtonEdit } from '../../../_metronic/partials/widgets/tables/modal/Planning/Edit'
import { ModalButtonCoordinate } from '../../../_metronic/partials/widgets/tables/modal/Planning/Coordinate'
import ModalButtonProject from '../../../_metronic/partials/widgets/tables/modal/Planning/UsulanModal'
import { UsersListHeader } from '../../../_metronic/partials/widgets/tables/header/UsersListHeader'
import { KTCard, KTSVG } from '../../../_metronic/helpers'

const Group = ({ postsPerPage, totalPosts, currentPage, setCurrentPage }) => {
  const pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i)
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const [pageNumberLimit, setpageNumberLimit] = useState(3);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li key={number} className='page-item'>
          <button
            id={number}
            onClick={handleClick}
            className={currentPage == number ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ padding: "7px 14px" }}
          >
            {number}
          </button>
        </li>
      );
    } else {
      return null;
    }
  });

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn =
      <li style={{ cursor: 'pointer' }} className='page-item previous' onClick={handleNextbtn} disabled={currentPage == pages[pages.length - 1] ? true : false}>
        <a className='page-link page-text me-5'>
          Next
        </a>
      </li>

  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn =
      <li style={{ cursor: 'pointer' }} className='page-item previous' onClick={handlePrevbtn} disabled={currentPage == pages[0] ? true : false}>
        <a className='page-link page-text me-5'>
          Previous
        </a>
      </li>
  }

  return (
    <div className='row mt-3'>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_users_paginate'>
          <ul className='pagination'>
            {pageDecrementBtn}
            {renderPageNumbers}
            {pageIncrementBtn}
          </ul>
        </div>
      </div>
    </div>
  )
}

const TablePlanning = () => {
  const token = localStorage.getItem('token')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState([])
  const [display, setDisplay] = useState('')
  const [lop, setLop] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  const [pageNumberLimit, setpageNumberLimit] = useState(3);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [warning, setWarning] = useState(false)

  const sto_style = (val) => {
    return { verticalAlign: "middle", width: `${val}vw` }
  }

  const getItem = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}planning/read/`;
    await axios.post(url, body, config)
      .then(res => {
        if (res.data instanceof Array) {
          setPosts(res.data)
          setDisplay(res.data)
          return
        }
        setWarning(true)
      })
      .catch(err => console.log(err))
  }

  const filter = (param, param2) => {
    const result = posts.filter((item) => {
      if (param === '' && param2 === '') {
        return item
      } else if (param2 !== '' && param !== '') {
        return item.status_microdemand === param && item.status_lop === param2
      } else {
        return item.status_microdemand === param || item.status_lop === param2
      }
    })
    setDisplay(result)
  }

  const filteredPost = Array.from(display).filter((val) => {
    if (search === "") {
      return val
    } else {
      return val = 
      val.nama_lop.toLowerCase().includes(search.toLocaleLowerCase()) ||
      val.tahun.toLowerCase().includes(search.toLocaleLowerCase())
    }
  })
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPost.slice(indexOfFirstPost, indexOfLastPost)
  const change = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const reset = () => {
    setDisplay(posts)
    setLop('')
    setStatus('')
  }

  useEffect(() => {
    getItem()
  }, []);
  return (
    <KTCard>
      <div className='card-header border-0 pt-6'>
        <div className='card-title'>
          <div className='d-flex align-items-center position-relative my-1'>
            <KTSVG
              path='/media/icons/duotune/general/gen021.svg'
              className='svg-icon-1 position-absolute ms-6'
            />
            <input
              type='text'
              className='form-control form-control-solid  w-250px ps-14'
              placeholder='Search...'
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <a
            href='#'
            className='btn btn-sm btn-flex btn-light btn-active-secondary text-muted fw-bold me-5'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen031.svg'
              className='svg-icon-5 svg-icon-gray-500 me-1 text-muted'
            />
            Filter
          </a>
          <div className='menu menu-sub menu-sub-dropdown w-300px w-md-350px' data-kt-menu='true'>
            <div className='px-7 py-5'>
              <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
            </div>

            <div className='separator border-gray-200'></div>

            <div className='px-7 py-5'>

              <div className='mb-10'>
                <label className='form-label fw-bold'>Micro Demand:</label>
                <select
                  className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                  aria-label="Select example"
                  value={lop}
                  onChange={(e) => { filter(e.target.value, status); setLop(e.target.value) }}
                >
                  <option value=''></option>
                  <option value='Blank'>Blank</option>
                  <option value='On Going'>On Going</option>
                  <option value='Rejected'>Rejected</option>
                  <option value='Approved'>Approved</option>
                </select>
              </div>
              <div className='mb-10'>
                <label className='form-label fw-bold'>Status LoP:</label>
                <select
                  className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                  aria-label="Select example"
                  value={status}
                  onChange={(e) => { filter(lop, e.target.value); setStatus(e.target.value) }}
                >
                  <option value=''></option>
                  <option value='Blank'>Blank</option>
                  <option value='Go'>Go</option>
                  <option value='No Go'>No Go</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type='reset'
                className='btn btn-light btn-danger mb-3 me-3'
                data-kt-users-modal-action='cancel'
                onClick={(e) => reset(e)}
              >
                Reset
              </button>
            </div>
          </div>
          <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
            <ModalButtonProject />
          </div>
        </div>
      </div>
      <div className='card-body py-4'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table id="kt_table_users" className="table table-rounded table-striped border gy-5 gs-7" role="table">
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-start text-uppercase'>
                <th className='text-center' role={"columnheader"} style={sto_style(6)}>Project</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Tahun</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>STO</th>
                <th className='required text-center' role={"columnheader"} style={sto_style(15)}>Nama LoP</th>
                <th className='text-center' role={"columnheader"} style={sto_style(10)}>Status Microdemand</th>
                <th className='text-center' role={"columnheader"} style={sto_style()} >Status LoP</th>
                <th className='text-center' role={"columnheader"} style={{ verticalAlign: "middle", width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center text-gray-600 fw-bold' role={"rowgroup"}>
              {currentPosts.length === 0 || warning ?
                <tr className='text-center text-muted'>
                  <td colSpan={7}>
                    no matching record found
                  </td>
                </tr>
                :
                <></>
              }
              {Array.from(currentPosts).map((item, i) => {
                return (
                  <tr key={i} role={"row"}>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.project}
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.tahun}
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.sto}
                    </td>
                    <td className='text-hover-primary text-start fw-normal' role={"button"}>
                      <ModalButtonCoordinate data={item} />
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.status_microdemand == 'Approved' &&
                        <span className='badge badge-light-success'>{item.status_microdemand}</span>
                      }
                      {item.status_microdemand == 'Rejected' &&
                        <span className='badge badge-light-danger'>{item.status_microdemand}</span>
                      }
                      {item.status_microdemand == 'On Going' &&
                        <span className='badge badge-light-warning'>{item.status_microdemand}</span>
                      }
                      {item.status_microdemand == 'Blank' &&
                        <span>{item.status_microdemand}</span>
                      }
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.status_lop}
                    </td>
                    <td className='d-flex justify-content-center' >
                      {/* <ModalButtonEdit data={item} /> */}
                      <ModalButtonAdd data={item} />

                      {/* action button */}
                      {/* <button
                          type="button"
                          className="btn btn-light btn-active-light-primary btn-sm position-static" data-kt-menu-trigger="click"
                          data-kt-menu-placement="bottom-end"
                          style={{width:"100%"}}
                        >
                          Actions
                          <KTSVG path='/media/icons/duotune/arrows/arr072.svg' className='svg-icon-5 m-0' />
                        </button>
                        <div
                          className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
                          data-kt-menu='true'
                        >
                          <div className='menu-item px-3 btn btn-light btn-active-light-primary btn-sm position-static'>
                            <ModalButtonAdd data={item} />
                          </div>
                          <div className='menu-item px-3'>
                            <ModalButtonEdit data={item} />
                          </div>
                        </div> */}
                      {/* end:action button */}

                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Group
          postsPerPage={postsPerPage}
          totalPosts={filteredPost.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </KTCard>
  )
}

export default TablePlanning
import { useEffect, useState } from 'react'
import { KTSVG } from '../../../_metronic/helpers'
import axios from 'axios'
import { ModalButtonUpdate } from './modal/Update-Construct'
import { ModalEvidence } from './modal/Evidence'
import ModalButtonProject from "./modal/Add-Lop"
import { KTCard } from '../../../_metronic/helpers'
import { Loader } from '../../components/Loader'

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

    if ((currentPage - 1) % pageNumberLimit === 0) {
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
            className={currentPage === number ? 'btn btn-primary' : 'btn btn-secondary'}
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
      <li style={{ cursor: 'pointer' }} className='page-item previous' onClick={handleNextbtn} disabled={currentPage === pages[pages.length - 1] ? true : false}>
        <a href className='page-link page-text me-5'>
          Next
        </a>
      </li>

  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn =
      <li style={{ cursor: 'pointer' }} className='page-item previous' onClick={handlePrevbtn} disabled={currentPage === pages[0] ? true : false}>
        <a href className='page-link page-text me-5'>
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

const TableConstruct = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('code8uhx9')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState('')
  const [display, setDisplay] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  const [warning, setWarning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [option, setOption] = useState([])
  const sto_style = (val) => {
    return { cursor: "pointer", verticalAlign: "middle", width: `${val}vw` }
  }

  const [preparing, setPreparing] = useState('')
  const [construction, setConstruction] = useState('')
  const [closing, setClosing] = useState('')
  const [status, setStatus] = useState('')
  const [waspang, setWaspang] = useState('')
  const [mitra, setMitra] = useState('')

  const getLop = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}planning/read/`;
    await axios.post(url, body, config)
      .then(res => {
        let findGo = res.data.filter(value => value.status_lop === "Go")
        let exactValue = findGo.map(value => value.nama_lop)
        setOption(exactValue)
      })
      .catch(err => console.log(err))
  }

  const getItem = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}construction/read/`;
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
      .finally(() => setLoading(false))
  }

  const filter = (param, param2, param3) => {
    setWaspang('')
    setMitra('')
    setStatus('')
    const result = posts.filter((item) => {
      if (param === '' && param2 === '' && param3 === '') {
        return item
      } else {
        return item.preparing === param || item.construction === param2 || item.closing === param3
      }
    })
    setDisplay(result)
  }

  const filterStatus = (param4) => {
    setPreparing('')
    setConstruction('')
    setClosing('')
    setWaspang('')
    setMitra('')
    const result = posts.filter((item) => {
      if (param4 === '') {
        return item
      } else {
        return item.status_lop === param4
      }
    })
    setDisplay(result)
  }

  const keysFilter = ['id_lop', 'nama_lop', 'nama_waspang', 'mitra_under_ta']

  const filteredPost = Array.from(display).filter((val) => {
    if (search === "") {
      return val
    // } else if (val.nama_lop.toLowerCase().includes(search.toLocaleLowerCase())) {
    //   return val
    // }
    }else{
      return val = keysFilter.some((key) => val[key].toLowerCase().includes(search.toLocaleLowerCase()))
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
    setPreparing('')
    setConstruction('')
    setClosing('')
    setStatus('')
    setWaspang('')
    setMitra('')
  }

  useEffect(() => {
    getLop()
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
              className='form-control form-control-solid w-250px ps-14'
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
            <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6 px-7 py-5">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_1"
                >
                  Construction
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_2"
                >
                  Status
                </a>
              </li>
            </ul>
            <div className="tab-content px-7 py-5" id="myTabContent">
              <div
                className="tab-pane active show"
                id="kt_tab_pane_1"
                role="tabpanel"
              >
                <div className='mb-10'>
                  <label className='form-label fw-bold'>Preparing:</label>
                  <select
                    className="form-select form-control form-control-lg form-control-solid"
                    aria-label="Select example"
                    value={preparing}
                    onChange={(e) => { filter(e.target.value, construction, closing); setPreparing(e.target.value) }}
                  >
                    <option value=''></option>
                    <option value='Blank'>Blank</option>
                    <option value='Aanwizing'>Aanwizing</option>
                    <option value='Perizinan'>Perizinan</option>
                    <option value='Mos'>Mos</option>
                    <option value='Selesai'>Selesai</option>
                  </select>
                </div>
                <div className='mb-10'>
                  <label className='form-label fw-bold'>Construction:</label>
                  <select
                    className="form-select form-control form-control-lg form-control-solid"
                    aria-label="Select example"
                    value={construction}
                    onChange={(e) => { filter(preparing, e.target.value, closing); setConstruction(e.target.value) }}
                  >
                    <option value=''></option>
                    <option value='Blank'>Blank</option>
                    <option value='Penanaman Tiang'>Penanaman Tiang</option>
                    <option value='Penarikan Kabel'>Penarikan Kabel</option>
                    <option value='Pemasangan ODP'>Pemasangan ODP</option>
                    <option value='Terminasi'>Terminasi</option>
                    <option value='CT/UT'>CT/UT</option>
                    <option value='Selesai'>Selesai</option>
                  </select>
                </div>
                <div className='mb-10'>
                  <label className='form-label fw-bold'>Closing:</label>
                  <select
                    className="form-select form-control form-control-lg form-control-solid"
                    aria-label="Select example"
                    value={closing}
                    onChange={(e) => { filter(preparing, construction, e.target.value); setClosing(e.target.value) }}
                  >
                    <option value=''></option>
                    <option value='Blank'>Blank</option>
                    <option value='Waiting ABD'>Waiting ABD</option>
                    <option value='Push SW'>Push SW</option>
                    <option value='Go Live'>Go Live</option>
                    <option value='Selesai'>Selesai</option>
                  </select>
                </div>
              </div>
              <div className="tab-pane" id="kt_tab_pane_2" role="tabpanel">
                <div className='mb-10'>
                  <label className='form-label fw-bold'>Status LoP:</label>
                  <select
                    className="form-select form-control form-control-lg form-control-solid"
                    aria-label="Select example"
                    value={status}
                    onChange={(e) => { filterStatus(e.target.value); setStatus(e.target.value) }}
                  >
                    <option value=''></option>
                    <option value='Aktif'>Aktif</option>
                    <option value='Drop'>Drop</option>
                  </select>
                </div>
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
            <ModalButtonProject option={option} role={role} />
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
                <th className='' role={"columnheader"} style={sto_style()} >Id LoP</th>
                <th className='' role={"columnheader"} style={sto_style()} >STO</th>
                <th className='' role={"columnheader"} style={sto_style()}>Nama LoP</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Waspang</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Mitra Under TA</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Preparing</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Construction</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Closing</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Status LOP</th>
                <th className='text-center' role={"columnheader"} style={sto_style()}>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center text-gray-600 fw-bold' role={"rowgroup"}>
              {loading ?
                <tr className='text-center'>
                  <td colSpan={10}>
                    <Loader minHeight={180} />
                  </td>
                </tr>
                : currentPosts.length === 0 || warning ?
                <tr className='text-center text-muted'>
                  <td colSpan={10}>
                    no matching record found
                  </td>
                </tr>
                :
                <></>
              }
              {Array.from(currentPosts).map((item, i) => {
                return (
                  <tr key={i} role={"row"}>
                    <td className='text-start fw-normal fs-6' role={"cell"}>
                      {item.id_lop}
                    </td>
                    <td className='text-start fw-normal fs-6' role={"cell"}>
                      {item.sto}
                    </td>
                    <td className='text-start fw-normal fs-6' role={"cell"}>
                      {item.nama_lop}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.nama_waspang}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.mitra_under_ta}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.preparing}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.construction}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.closing}
                    </td>
                    <td className='text-center fw-normal fs-6' role={"cell"}>
                      {item.status_lop == 'Aktif' &&
                        <span className='badge badge-light-success'>{item.status_lop}</span>
                      }
                      {item.status_lop == 'Drop' &&
                        <span className='badge badge-light-danger'>{item.status_lop}</span>
                      }
                    </td>
                    {role === 'Ya1DGCVUDpd7UbKBjvUh' || role === 'cckmdshMhcDluEEWVHNc' ?
                      <td className='d-flex justify-content-center' >
                        <div className='menu-item'>
                          <ModalButtonUpdate data={item} role={role} option={option} />
                        </div>
                        <div className='menu-item'>
                          <ModalEvidence data={item} />
                        </div>
                      </td> :
                      <td className='d-flex justify-content-center' >
                        <div className='menu-item px-3'>
                          <ModalEvidence data={item} />
                        </div>
                      </td>
                    }
                  </tr>
                )
              })}

            </tbody>
          </table>
        </div>
        <Group
          postsPerPage={postsPerPage}
          totalPosts={filteredPost.length}
          change={change}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </KTCard>
  )
}

export default TableConstruct
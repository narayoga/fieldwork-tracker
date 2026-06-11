import { useEffect, useState } from 'react'
import axios from 'axios'
import ModalButtonProject from '../tables/modal-golive/Add-Golive'
import { KTCard, KTSVG } from '../../../_metronic/helpers'
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

const TableGoLive = () => {
  const token = localStorage.getItem('token')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)

  const [pageNumberLimit, setpageNumberLimit] = useState(3);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [warning, setWarning] = useState(false)
  const [loading, setLoading] = useState(true)

  const sto_style = (val) => {
    return { verticalAlign: "middle", width: `${val}vw` }
  }

  const getItem = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}odp/read/`;
    await axios.post(url, body, config)
      .then(res => {
        if (res.data instanceof Array) {
          setPosts(res.data)
          return
        }
        setWarning(true)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const keysFilter = ['nama_lop', 'nama_odp', 'distribusi', 'tgl_golive']

  const filteredPost = Array.from(posts).filter((val) => {
    if (search === "") {
      return val
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
              className='form-control form-control-solid w-250px ps-14'
              placeholder='Search...'
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='card-toolbar'>
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
              <tr className='fw-bolder text-uppercase'>
                <th className='text-center' role={"columnheader"} style={sto_style(5)}>Nama LoP</th>
                <th className='text-center' role={"columnheader"} style={sto_style(5)}>Tanggal</th>
                <th className='text-center' role={"columnheader"} style={sto_style(5)}>Nama ODP</th>
                <th className='text-center' role={"columnheader"} style={sto_style(5)}>Distribusi</th>
              </tr>
            </thead>
            <tbody className='text-center text-gray-600 fw-bold' role={"rowgroup"}>
              {loading ?
                <tr className='text-center'>
                  <td colSpan={7}>
                    <Loader minHeight={180} />
                  </td>
                </tr>
                : currentPosts.length === 0 || warning ?
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
                      {item.nama_lop}
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.tgl_golive}
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.nama_odp}
                    </td>
                    <td className='text-center fw-normal' role={"cell"}>
                      {item.distribusi}
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

export default TableGoLive
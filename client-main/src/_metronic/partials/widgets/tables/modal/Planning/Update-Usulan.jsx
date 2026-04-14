import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../../helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'

const ModalBody = (props) => {
  const [microdemand, setMicrodemand] = useState(props.data.status_microdemand)
  const [status, setStatus] = useState(props.data.status_lop)
  const [keterangan, setKeterangan] = useState(props.data.keterangan)
  const [warning, setWarning] = useState('')
  const [list, setList] = useState([
    {
      name: props.data.nama_lop,
      location: [],
    }
  ])
  const [additem, setAdditem] = useState('')
  const [location, setLocation] = useState('')
  const [locolection, setLocolection] = useState('')
  const token = localStorage.getItem('token')

  const addLoco = (e) => {
    e.preventDefault()
    let data = [...locolection]
    data.push(location)
    setLocolection(data)
    setLocation('')
  }

  const url = `${process.env.REACT_APP_API_URL}planning/update/`;
  const urlLoc = `${process.env.REACT_APP_API_URL}planning/odp/`
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning('Loading...')
    const bodyUpdate = {
      project: props.data.project,
      tahun: props.data.tahun,
      sto: props.data.sto,
      nama_lop: props.data.nama_lop,
      nama_lop_baru: props.data.nama_lop,
      status_microdemand: microdemand,
      status_lop: status,
      keterangan
    };
    axios
      .post(url, bodyUpdate, config)
      .then((res) => {
        if (res.data.message === "Query Error") {
          return setWarning('Query error')
        }
        if (locolection !== '') {
          addHandle()
        } else {
          window.location.reload()
        }
      })
      .catch((err) => {
        console.log("failed,", err.message);
        setWarning("Internal Server Error")
      });
  }

  const addHandle = async () => {
    let data = [...list]
    data.push({ name: additem, location: locolection })
    setList(data)
    setAdditem('')
    const bodyLoc = {
      nama_lop: props.data.nama_lop,
      koordinat: locolection
    }
    await axios.post(urlLoc, bodyLoc, config)
      .then(res => {
        setWarning(res.data.message)
        window.location.reload()
      })
      .catch(err => console.log('error', err))
  }

  const deleteHandle = (e, name) => {
    e.preventDefault()
    let data = [...locolection]
    data = data.filter(item => item !== name)
    return setLocolection(data)
  }

  const reset = (e) => {
    e.preventDefault()
    setLocolection('')
    setLocation('')
    setAdditem('')
  }

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' noValidate>
        {/* begin::form */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='mb-7'>
            <label className='fw-bold fs-6 mb-5'>Status Microdemand</label>
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              value={microdemand}
              onChange={(e) => setMicrodemand(e.target.value)}
            >
              <option value="Blank">Blank</option>
              <option value="On Going">On Going</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          {/* end::Input group */}
          <div className='mb-7'>
            <label className='fw-bold fs-6 mb-5'>Status LoP</label>
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Blank">Blank</option>
              <option value="Go">Go</option>
              <option value="No Go">No Go</option>
            </select>
          </div>
          <div className='mb-7'>
            <label className='fw-bold fs-6 mb-5'>Keterangan</label>
            <textarea
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
              )}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
              cols={5}
            />
          </div>
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Koordinat</label>
            <div className='d-flex' style={{ width: "100%" }}>
              <div style={{ width: "100%" }}>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  name='accountName'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <span className='ms-2 fs-8 text-danger'>value example: -1.239899,116.866639 </span>
              </div>
              <div className='mt-2'>
                <button className='ms-3 btn btn-secondary me-5' onClick={(e) => { addLoco(e) }}>add </button>
                {/* <button className='btn btn-info' onClick={print}>print</button> */}
              </div>
            </div>
            <div className='mt-5 py-4'>
              <label className='d-flex text-muted align-items-center form-label mb-5'>
                Selected Location Ready to Submit!
                <i
                  className='fas fa-exclamation-circle ms-2 fs-7'
                  data-bs-toggle='tooltip'
                  title='Monthly billing will be based on your account plan'
                ></i>
              </label>
              <div className='pe-4 overflow-auto' style={{ height: "100px" }}>
                {Array.from(locolection).map((loc, i) => {
                  return (
                    <div key={i} className='d-flex justify-content-between pe-3'>
                      <p className='text-dark fw-bold ' key={i}>{loc} </p>
                      <span onClick={(e) => { deleteHandle(e, loc) }} className='text-danger cursor-pointer'>delete</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {warning === "Data tersimpan" &&
          <div className='alert alert-success d-flex'>
            <div className='alert-text font-weight-bold ms-2 position-relative'>Success!</div>
          </div>
        }
        {warning === "Query Error" &&
          <div className='alert alert-danger d-flex'>
            <div className='alert-text font-weight-bold ms-2 position-relative'>Query Error</div>
          </div>
        }
        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button type='button' className='btn btn-light me-3' onClick={(e) => reset(e)}>
            Reset
          </button>
          <button onClick={(e) => { handleSubmit(e) }} type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button>
        </div>
        {/* end::Actions */}
      </form>
    </>
  )
}

const ModalUser = (props) => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])
  const nama_lop = props.data.nama_lop

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ width: "100%" }}
      animation={false}
    >
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <div className="modal-header">
              <h2 className="modal-title text-uppercase">Update Usulan <span className='ms-3 fs-5 text-muted'>{nama_lop}</span> </h2>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={props.onHide}
              >
                <KTSVG
                  path="/media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
                />
              </div>
            </div>
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5 mx-xl-15'>
              <ModalBody data={props.data} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ModalButtonAdd = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const { data } = props
  return (
    <>
      {/* <a className='text-primary menu-link px-3' onClick={() => setModalShow(true)}>
        Add Odp
      </a> */}
      <div onClick={() => setModalShow(true)} style={{ padding: "8px 10px" }} className='btn btn-light btn-active-light-primary btn-sm position-static'>
        <i className="bi bi-plus-circle text-primary fs-6"></i>
      </div>

      <ModalUser
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={data}
      />
    </>
  )
}

export { ModalButtonAdd }

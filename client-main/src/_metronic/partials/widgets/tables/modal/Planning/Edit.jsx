import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../../helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import OptionSto from '../../json/sto.json'

const ModalBody = (props) => {
  // Add Project
  const sliceLop = props.data.nama_lop.slice(11)
  const [name, setName] = useState(props.data.project)
  const [tahun, setTahun] = useState(props.data.tahun)
  const [sto, setSto] = useState(props.data.sto)
  const [lop, setLop] = useState(sliceLop)
  const [microdemand, setMicrodemand] = useState(props.data.status_microdemand)
  const [status, setStatus] = useState(props.data.status_lop)

  const [warning, setWarning] = useState(false)

  let suffix = tahun.slice(2, 4)
  const lopSubmit = `${name + suffix}-${sto}-${lop}`
  const staticLop = props.data.nama_lop

  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const urlLoc = `${process.env.REACT_APP_API_URL}planning/odp/`
  const url = `${process.env.REACT_APP_API_URL}planning/update/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning('Loading...')
    const bodyUpdate = {
      project: name,
      tahun,
      sto,
      nama_lop: props.data.nama_lop,
      nama_lop_baru: lopSubmit,
      status_microdemand: microdemand,
      status_lop: status
    };
    await axios
      .post(url, bodyUpdate, config)
      .then((res) => {
        if (res.data.message === "Query Error") {
          setWarning('Query error')
        } else {
          addHandle()
        }
      })
      .catch((err) => {
        console.log("failed,", err.message);
        setWarning("Internal Server Error")
      });
  }

  //add Location
  const [list, setList] = useState([
    {
      name: lopSubmit,
      location: [],
    }
  ])
  const [additem, setAdditem] = useState('')
  const [location, setLocation] = useState('')
  const [locolection, setLocolection] = useState('')

  const addLoco = (e) => {
    e.preventDefault()
    let data = [...locolection]
    data.push(location)
    setLocolection(data)
    setLocation('')
  }

  const bodyLoc = {
    nama_lop: lopSubmit,
    koordinat: locolection
  }

  const addHandle = async () => {
    let data = [...list]
    data.push({ name: additem, location: locolection })
    setList(data)
    setAdditem('')
    // setLocolection('')
    if (locolection.length < 1) {
     setWarning('no location submited')
     return window.location.reload()
    }
    await axios.post(urlLoc, bodyLoc, config)
      .then(res => {
        setWarning(false)
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  const deleteHandle = (e, name) => {
    e.preventDefault()
    let data = [...locolection]
    data = data.filter(item => item !== name)
    return setLocolection(data)
  }

  return (
    <>
      <div className="modal-body d-flex justify-content-center">
        <>
          <form style={{ width: "40%" }} id='kt_modal_add_user_form' className='form me-2' noValidate>
            {/* begin::form */}
            <div
              className='d-flex text-start flex-column me-n7 pe-7'
              id='kt_modal_add_user_scroll'
              data-kt-scroll='true'
              data-kt-scroll-activate='{default: false, lg: true}'
              data-kt-scroll-max-height='auto'
              data-kt-scroll-dependencies='#kt_modal_add_user_header'
              data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
              data-kt-scroll-offset='300px'
            >
              <div className='fv-row mb-7'>
                <label className='required fw-bold fs-6 mb-2'>Project</label>
                <select
                  className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                  aria-label="Select example"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >
                  <option value="OSP1">OSP1</option>
                  <option value="OSP2">OSP2</option>
                </select>
              </div>

              <div className='fv-row mb-7'>
                <label className='required fw-bold fs-6 mb-2'>Tahun</label>
                <input
                  required
                  maxLength={4}
                  aria-label="Select example"
                  placeholder='Tahun'
                  type='text'
                  name='tahun'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                  )}
                  autoComplete='off'
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                />
              </div>

              <div className='fv-row mb-7'>
                <label className='required fw-bold fs-6 mb-2'>STO</label>
                <select
                  className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                  aria-label="Select example"
                  value={sto}
                  onChange={(e) => setSto(e.target.value)}
                >
                  {OptionSto.map((item) => {
                    return (
                      <option key={item.id} value={item.sto}>{item.sto}</option>
                    )
                  })}
                </select>
              </div>

              <div className='fv-row mb-7'>
                <label className='required fw-bold fs-6 mb-2'>Nama LoP</label>
                <div className='d-flex'>
                  <input className={clsx('form-control form-control-solid mb-3 mb-lg-0')} readOnly style={{ width: '100px' }} value={name + suffix} />
                  <div className='separator mx-1 my-4'>-</div>
                  <input className={clsx('form-control form-control-solid mb-3 mb-lg-0')} readOnly style={{ width: '60px' }} value={sto} />
                  <div className='separator mx-1 my-4'>-</div>
                  <input
                    required
                    placeholder='LoP'
                    type='text'
                    name='name'
                    className={clsx(
                      'form-control form-control-solid mb-3 mb-lg-0',
                    )}
                    autoComplete='off'
                    value={lop}
                    onChange={(e) => setLop(e.target.value)}
                  />
                </div>
                {/* <input value={lopSubmit} /> */}
              </div>

              {/* begin::Input group */}
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
              {/* end::form */}
            </div>
          </form>
        </>
        <>
          <form style={{ width: "40%" }} id='kt_modal_add_user_form' className='form ms-2' noValidate>
            {/* begin::form */}
            <div
              className='d-flex text-start flex-column scroll-y me-n7 pe-7'
              id='kt_modal_add_user_scroll'
              data-kt-scroll='true'
              data-kt-scroll-activate='{default: false, lg: true}'
              data-kt-scroll-max-height='auto'
              data-kt-scroll-dependencies='#kt_modal_add_user_header'
              data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
              data-kt-scroll-offset='300px'
            >
              <div className='fv-row mb-7'>
                <label className='fw-bold fs-6 mb-2'>Nama LoP</label>
                <p className='form-control form-control-lg form-control-solid' style={{ width: "100%" }}>
                  {lopSubmit}
                </p>
                <label className='required fw-bold fs-6 mb-2'>location</label>
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
                <div className='mt-5 py-4' style={{ width: "100%" }}>
                  <label className='d-flex text-muted align-items-center form-label mb-5'>
                    Selected Location Ready to Submit!
                    <i
                      className='fas fa-exclamation-circle ms-2 fs-7'
                      data-bs-toggle='tooltip'
                      title='Monthly billing will be based on your account plan'
                    ></i>
                  </label>
                  <div className='pe-4 overflow-auto' style={{ height: "150px" }}>
                    {Array.from(locolection).map((loc, i) => {
                      return (
                        <div key={i} className='d-flex justify-content-between'>
                          <p className='text-dark fw-bold ' key={i}>{loc} </p>
                          <span onClick={(e) => { deleteHandle(e, loc) }} className='text-danger cursor-pointer pe-4'>delete</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      </div>
      {
        warning &&
        <div className='d-flex justify-content-center'>
          {warning === "Loading..." ?
            <div style={{ width: "80%" }} className=' alert alert-muted'>
              <div className='d-flex '>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                </div>
                <div className='alert-text font-weight-bold'>Loading...</div>
              </div>
            </div>
            :
            <div style={{ width: "80%" }} className='mx-auto alert alert-danger'>
              <div className='alert-text font-weight-bold'>{warning}</div>
            </div>
          }
        </div>
      }

      <div className="modal-footer">
        {tahun === '' || lop === '' ?
          <button disabled type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button> :
          <button onClick={(e) => handleSubmit(e)} type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button>
        }
      </div>
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

  return (
    <Modal
      {...props}
      size="fullscreen"
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
        <div className='modal-dialog modal-fullscreen'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder'>Edit </h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                style={{ cursor: 'pointer' }}
                onClick={props.onHide}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <ModalBody data={props.data} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ModalButtonEdit = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const { data } = props
  return (
    <>
      {/* <a className='text menu-link px-3' onClick={() => setModalShow(true)}>
        Edit
      </a> */}
      <div onClick={() => setModalShow(true)} style={{ padding: "8px 10px" }} className='btn btn-light btn-active-light-primary btn-sm position-static'>
        <i className="bi bi-sliders text-muted fs-6"></i>
      </div>


      <ModalUser
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={data}
      />
    </>
  )
}

export { ModalButtonEdit }

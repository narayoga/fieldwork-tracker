import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../../helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import OptionSto from '../../json/sto.json'

const ModalButtonProject = () => {
  // Add Project
  const [name, setName] = useState('OSP1')
  const [tahun, setTahun] = useState('')
  const [sto, setSto] = useState('GSA')
  const [lop, setLop] = useState('')
  const [microdemand, setMicrodemand] = useState('Blank')
  const [status, setStatus] = useState('Blank')
  const [keterangan, setKeterangan] = useState('')

  const [warning, setWarning] = useState(false)

  let suffix = tahun.slice(2, 4)
  const lopSubmit = `${name + suffix}-${sto}-${lop}`

  const token = localStorage.getItem('token')

  const reset = () => {
    setTahun('')
    setLop('')
    setName('OSP1')
    setSto('GSA')
    setStatus(' ')
    setMicrodemand(' ')
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

  const urlLoc = `${process.env.REACT_APP_API_URL}planning/odp/`
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const bodyLoc = {
    nama_lop: lopSubmit,
    koordinat: locolection
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning('Loading...')
    const bodyUpdate = {
      project: name,
      tahun,
      sto,
      nama_lop: lopSubmit,
      status_microdemand: microdemand,
      status_lop: status,
      keterangan
    };
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}planning/`;
    axios
      .post(url, bodyUpdate, config)
      .then((res) => {
        if (res.data.message === "Key Duplicate")
          return setWarning("Project Already Exist")
        if (locolection !== '') {
          addHandle(e)
        } else {
          window.location.reload()
        }
      })
      .catch((err) => {
        console.log("failed,", err.message);
        setWarning("Internal Server Error")
      });
  }

  const addHandle = async (e) => {
    e.preventDefault()
    let data = [...list]
    data.push({ name: additem, location: locolection })
    setList(data)
    setAdditem('')
    setLocolection('')
    await axios.post(urlLoc, bodyLoc, config)
      .then(res => {
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

    <div>
      <button type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_2"
      >
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Tambah Usulan
      </button>
      <div className="modal bg-white" tabIndex={-1} id="kt_modal_2">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content shadow-none">
            <div className="modal-header">
              <h2 className="modal-title text-uppercase">Tambah Usulan</h2>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <KTSVG
                  path="/media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
                />
              </div>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <>
                <form style={{ width: "40%" }} id='kt_modal_add_user_form' className='form me-2' noValidate>
                  {/* begin::form */}
                  <div
                    className='d-flex flex-column me-n7 pe-7'
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
                          ='LoP'
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
                  {warning === "Data tersimpan" &&
                    <div className='alert alert-success d-flex'>
                      <div className='alert-text font-weight-bold ms-2 position-relative'>Success!</div>
                    </div>
                  }
                  {warning === "Query Error" &&
                    <div className='alert alert-danger d-flex'>
                      <div className='alert-text font-weight-bold ms-2 position-relative'>{warning}</div>
                    </div>
                  }
                  {/* begin::Actions */}
                  {/* <div className='text-center pt-15'>
                    <button type='button' className='btn btn-light me-3' onClick={(e) => reset(e)}>
                      Reset
                    </button>

                    {locolection.length < 1 ?
                      <button disabled type='submit' className='btn btn-primary'>
                        <span className='indicator-label'>Submit</span>
                      </button> :
                      <button onClick={(e) => { addHandle(e) }} type='submit' className='btn btn-primary'>
                        <span className='indicator-label'>Submit</span>
                      </button>
                    }
                  </div> */}
                  {/* end::Actions */}
                </form>
              </>
            </div>

            {warning &&
              <div className='d-flex justify-content-center'>
                {warning === "Loading..." ?
                  <div style={{ width: "80%" }} className=' alert alert-muted'>
                    <div className='d-flex '>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                      </div>
                      <div className='alert-text font-weight-bold'>{warning}</div>
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
              <button
                type='reset'
                className='btn btn-light me-3'
                data-kt-users-modal-action='cancel'
                onClick={() => reset()}
              >
                Reset
              </button>
              {tahun === '' || lop === '' ?
                <button disabled type='submit' className='btn btn-primary'>
                  <span className='indicator-label'>Submit</span>
                </button> :
                <button onClick={handleSubmit} type='submit' className='btn btn-primary'>
                  <span className='indicator-label'>Submit</span>
                </button>
              }
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}

export default ModalButtonProject

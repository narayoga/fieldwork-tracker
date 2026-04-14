import { useEffect, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { KTSVG } from '../../../../_metronic/helpers'
import { Modal } from 'react-bootstrap'
import OptionSto from '../../../../_metronic/partials/widgets/tables/json/sto.json'
import Select from 'react-select'

const ModalUser = (props) => {
  const blank = ''
  const [idlop, setIdlop] = useState('')
  const [lop, setLop] = useState(blank)
  const [odp_plan, setOdp_plan] = useState('')
  const [waspang, setWaspang] = useState('')
  const [mitra, setMitra] = useState('')
  const [preparing, setPreparing] = useState("Blank")
  const [construction, setConstruction] = useState("Blank")
  const [closing, setClosing] = useState("Blank")
  const [status, setStatus] = useState('Aktif')
  const sto = lop.slice(7, 10)

  const [warning, setWarning] = useState('')
  const token = localStorage.getItem('token')
  const option = props.option

  //select option
  const handleChange = (selected) => {
    setLop(selected.value)
  }
  const costumStyle = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'black' : 'black',
      backgroundColor: state.isFocused ? '#e0e0e6' : '#eef3f7'
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? 'none' : 'none',
      backgroundColor: '#f5f8fa',
      height: '40px'
    })
  }
  const options = 
    option.map((item) => {
      return (
        { value: item, label: item }
      )
    })
  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning('Loading...')
    const bodyUpdate = {
      id_lop: idlop,
      nama_lop: lop,
      sto: sto,
      odp_plan: odp_plan,
      nama_waspang: waspang,
      mitra_under_ta: mitra,
      preparing: preparing,
      construction: construction,
      closing: closing,
      status_lop: status
    };
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}construction/`;
    await axios
      .post(url, bodyUpdate, config)
      .then((res) => {
        if (res.data.message === "Key Duplicate")
          return setWarning("Project Already Exist")
        window.location.reload()
      })
      .catch((err) => {
        console.log("failed,", err.message);
        setWarning("Internal Server Error")
      });
  }

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
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder'>Input LoP </h2>
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
            <div className='modal-body scroll-y mx-5 mx-xl-15'>

              <form id='kt_modal_add_user_form' className='form me-2' noValidate>
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
                  <div className='fv-row mb-2'>
                    <label className='fw-bold fs-6 mb-2'>Id LoP</label>
                    <input
                      aria-label="Select example"
                      type='text'
                      name='tahun'
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                      )}
                      autoComplete='off'
                      value={idlop}
                      onChange={(e) => setIdlop(e.target.value)}
                    />
                  </div>

                  {/* <div className='mb-2'>
                    <label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
                    <select
                      className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                      aria-label="Select example"
                      value={lop}
                      onChange={(e) => setLop(e.target.value)}
                    >
                      {options.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>{item.label}</option>
                        )
                      })}
                    </select>
                  </div> */}

                  <div className='mb-2'>
                    <label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
                    <Select className=''
                      styles={costumStyle}
                      onChange={handleChange}
                      options={options}
                    />
                  </div>

                  <div className='fv-row mb-2'>
                    <label className='fw-bold fs-6 mb-2'>ODP Plan</label>
                    <input
                      type='text'
                      name='ODP plan'
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                      )}
                      autoComplete='off'
                      value={odp_plan}
                      onChange={(e) => setOdp_plan(e.target.value)}
                    />
                  </div>

                  <div className='fv-row mb-2'>
                    <label className='fw-bold fs-6 mb-2'>Nama Waspang</label>
                    <input
                      type='text'
                      name='waspang'
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                      )}
                      autoComplete='off'
                      value={waspang}
                      onChange={(e) => setWaspang(e.target.value)}
                    />
                  </div>

                  <div className='fv-row mb-2'>
                    <label className='fw-bold fs-6 mb-2'>Mitra Under TA</label>
                    <input
                      type='text'
                      name='mitra'
                      className={clsx(
                        'form-control form-control-solid mb-3 mb-lg-0',
                      )}
                      autoComplete='off'
                      value={mitra}
                      onChange={(e) => setMitra(e.target.value)}
                    />
                  </div>

                  <div className='mb-2'>
                    <label className='required fw-bold fs-6 mb-5'>Status LoP</label>
                    <select
                      className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                      aria-label="Select example"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option defaultValue='Aktif'>Aktif</option>
                      <option value="Drop">Drop</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  {warning &&
                    <>
                      {warning === 'Loading...' ?
                        <div className='alert alert-muted d-flex'>
                          <div className="spinner-border spinner-border-sm" role="status">
                          </div>
                          <div className='alert-text font-weight-bold ms-2 position-relative' style={{ top: "-2px" }}>loading...</div>
                        </div>
                        :
                        <div className='alert alert-danger d-flex'>
                          <div className='alert-text font-weight-bold ms-2 position-relative' style={{ top: "-2px" }}>{warning}</div>
                        </div>
                      }
                    </>
                  }

                  {idlop === '' && lop === '' ?
                    <button disabled type='submit' className='btn btn-primary'>
                      <span className='indicator-label'>Submit</span>
                    </button> :
                    <button onClick={handleSubmit} type='submit' className='btn btn-primary'>
                      <span className='indicator-label'>Submit</span>
                    </button>
                  }
                  {/* <button onClick={(e) => { console.log(options); console.log(optio); e.preventDefault(e) }} className='btn btn-info'>
                    <span className='indicator-label'>Print</span>
                  </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ModalButtonProject = (props) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      {props.role === 'cckmdshMhcDluEEWVHNc' ?
        <button type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_2"
          onClick={() => setModalShow(true)}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add LoP
        </button> :
        <button type="button"
          className="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_2"
          onClick={() => setModalShow(true)}
          disabled
        >
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add LoP
        </button>
      }
      <ModalUser
        show={modalShow}
        onHide={() => setModalShow(false)}
        option={props.option}
      />
    </>
  )
}

export default ModalButtonProject

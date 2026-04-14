import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { left } from '@popperjs/core'

const ModalBody = (props) => {
  const [idlop, setIdlop] = useState(props.data.id_lop)
  const [lop, setLop] = useState(props.data.nama_lop)
  const [odp_plan, setOdp_plan] = useState(props.data.odp_plan)
  const [odp_actual, setOdp_actual] = useState(props.data.odp_actual)
  const [waspang, setWaspang] = useState(props.data.nama_waspang)
  const [mitra, setMitra] = useState(props.data.mitra_under_ta)
  let [preparing, setPreparing] = useState(props.data.preparing)
  let [construction, setConstruction] = useState(props.data.construction)
  let [closing, setClosing] = useState(props.data.closing)
  const [status, setStatus] = useState(props.data.status_lop)
  const [keterangan, setKeterangan] = useState(props.data.keterangan)
  const [step, setStep] = useState('')
  const [img, setImg] = useState('')
  const [file, setFile] = useState('')
  const [preview, setPreview] = useState('')
  const [change, setChange] = useState(false)
  const sto = props.data.sto
  const option = props.option

  const [warning, setWarning] = useState('')

  const token = localStorage.getItem('token')

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const url = `${process.env.REACT_APP_API_URL}construction/update/`;

  const onSubmit = (e) => {
    e.preventDefault();
    setWarning(true)
    if (img !== '') {
      const bodyUpdate = {
        id_lop: idlop,
        nama_lop: lop,
        sto: sto,
        nama_waspang: waspang,
        mitra_under_ta: mitra,
        preparing: preparing,
        construction: construction,
        closing: closing,
        status_lop: status,
        odp_actual,
        keterangan
      };
      axios
        .post(url, bodyUpdate, config)
        .then((res) => {
          handleImg()
        })
        .catch((err) => {
          console.log("failed submit,", err.message);
          setWarning("Internal Server Error")
        });
    } else {
      if (construction === 'Penarikan Kabel') {
        const bodyUpdate = {
          id_lop: idlop,
          nama_lop: lop,
          sto: sto,
          nama_waspang: waspang,
          mitra_under_ta: mitra,
          preparing,
          construction,
          closing,
          status_lop: status,
          odp_actual
        };
        axios
          .post(url, bodyUpdate, config)
          .then((res) => {
            setWarning(false)
            window.location.reload()
          })
          .catch((err) => {
            console.log("failed submit,", err.message);
            setWarning("Internal Server Error")
          });
        return
      }
      const bodyUpdate = {
        id_lop: idlop,
        nama_lop: lop,
        sto: sto,
        nama_waspang: waspang,
        mitra_under_ta: mitra,
        preparing: preparing,
        construction: construction,
        closing: closing,
        status_lop: status,
        odp_actual,
        keterangan
      };
      axios
        .post(url, bodyUpdate, config)
        .then((res) => {
          window.location.reload()
        })
        .catch((err) => {
          setWarning("Internal Server Error")
        });
    }
  }
  const handleImg = async (e) => {

    let data = new FormData()
    data.append('sendimage', img)
    data.append('nama_lop', lop)
    data.append('step', step)
    data.append('_method', 'PUT')

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // const config = { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}construction/upload/`;
    await axios
      .post(url, data, config)
      .then((res) => {
        setWarning(false)
        window.location.reload()
      })
      .catch((err) => {
        console.log("failed image,", err);
      });
  }

  const setImage = (e) => {
    setImg(e.target.files[0])
    setPreview(URL.createObjectURL(e.target.files[0]))
    // console.log(img)
  }

  return (
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
        <div className='mb-2'>
          <label className='fw-bold fs-6 mb-5'>Id LoP</label>
          <input
            type='text'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
            )}
            value={idlop}
            onChange={(e) => { setIdlop(e.target.value); setChange(true) }}
          />
        </div>

        <div className='mb-2'>
          <label className='fw-bold fs-6 mb-5'>Nama Waspang</label>
          <input
            type='text'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
            )}
            value={waspang}
            onChange={(e) => { setWaspang(e.target.value); setChange(true) }}
          />
        </div>

        <div className='mb-2'>
          <label className='fw-bold fs-6 mb-5'>Nama Mitra</label>
          <input
            type='text'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
            )}
            value={mitra}
            onChange={(e) => { setMitra(e.target.value); setChange(true) }}
          />
        </div>

        <div className='mb-2'>
          <label className='fw-bold fs-6 mb-5'>ODP Plan</label>
          <input
            readOnly
            type='text'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
            )}
            value={odp_plan}
          />
        </div>

        <div className='mb-2'>
          <label className='fw-bold fs-6 mb-5'>ODP Actual</label>
          <input
            type='text'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
            )}
            autoComplete='off'
            value={odp_actual}
            onChange={(e) => { setOdp_actual(e.target.value); setChange(true) }}
          />
        </div>

        <div className='mb-2'>
          <label className=' fw-bold fs-6 mb-5'>Preparing</label>
          {construction === 'Blank' || construction === '' ?
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              onChange={(e) => { setPreparing(e.target.value); setStep(e.target.value) }}
              value={preparing}
            >
              <option value="Blank">Blank</option>
              <option value="Aanwizing">Aanwizing</option>
              <option value="Perizinan">Perizinan</option>
              <option value="MOS">MOS</option>
              <option value="Selesai">Selesai</option>
            </select> :
            <input
              type='text'
              className={clsx(
                'form-control form-control-lg form-control-solid is-valid',
              )}
              autoComplete='off'
              value={preparing}
              readOnly
            />
          }
        </div>

        {preparing === 'Selesai' &&
          <div className='mb-2'>
            <label className=' fw-bold fs-6 mb-5'>Construction</label>
            {closing === 'Blank' || closing === '' ?
              <select
                className=" mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
                onChange={(e) => { setConstruction(e.target.value); setStep(e.target.value) }}
                value={construction}
              >
                <option value="Blank">Blank</option>
                {props.data.construction == 'Blank' ?
                  <option value="Penanaman Tiang">Penanaman Tiang</option>
                  :
                  <option disabled className='text-muted' value="Penanaman Tiang">Penanaman Tiang</option>
                }
                {props.data.construction == 'Penanaman Tiang' ?
                  <option value="Penarikan Kabel">Penarikan Kabel</option>
                  :
                  <option disabled className='text-muted' value="Penarikan Kabel">Penarikan Kabel</option>
                }
                {props.data.construction == 'Penarikan Kabel' ?
                  <option value="Pemasangan ODP">Pemasangan ODP</option>
                  :
                  <option disabled className='text-muted' value="Pemasangan ODP">Pemasangan ODP</option>
                }
                {props.data.construction == 'Pemasangan ODP' ?
                  <option value="Terminasi">Terminasi</option>
                  :
                  <option disabled className='text-muted' value="Terminasi">Terminasi</option>
                }
                {props.data.construction == 'Terminasi' ?
                  <option value="CT/UT">CT/UT</option>
                  :
                  <option disabled className='text-muted' value="CT/UT">CT/UT</option>
                }
                {props.data.construction == 'CT/UT' ?
                  <option value="Selesai">Selesai</option>
                  :
                  <option disabled className='text-muted' value="Selesai">Selesai</option>
                }
              </select>
              :
              <input
                type='text'
                className={clsx(
                  'form-control form-control-lg form-control-solid is-valid',
                )}
                autoComplete='off'
                value={construction}
                readOnly
              />
            }
          </div>
        }

        {construction === 'Selesai' &&
          <div className='mb-2'>
            <label className=' fw-bold fs-6 mb-5'>Closing</label>
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              onChange={(e) => { setClosing(e.target.value); setStep(e.target.value) }}
              value={closing}
            >
              <option value="Blank">Blank</option>
              <option value="Waiting ABD">Waiting ABD</option>
              <option value="Push SW">Push SW</option>
              <option value="Go Live">Go Live</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        }
        {step === 'Penanaman Tiang' || step === 'Penarikan Kabel' || step === 'Pemasangan ODP' || step === 'Terminasi' || step === 'CT/UT' ?
          <div className='slide-down-wawa'>
            <input
              style={{ width: "50%" }}
              className={clsx(
                'form-control form-control-solid fs-8 border-primary',
              )}
              aria-label="Select example"
              type="file"
              accept=".jpg, .jpeg, .png"
              name="file"
              onChange={setImage}
            />
            <div className='fv-help-block text-muted mb-2 ps-4 fs-9 required '>
              <span>{step}</span>
            </div>
            <div className='mb-2 form-control' style={{ height: "300px" }}>
              <div className='mx-auto' style={{ width: 'fit-content' }}>
                <img style={{ height: '280px', maxWidth: '450px' }} alt=' ' src={preview} />
              </div>
            </div>
          </div>
          :
          null
        }

        {step === 'Go Live' ?
          <div className='slide-down-wawa mt-1 mb-5'>
            <input
              style={{ width: "50%" }}
              className={clsx(
                'form-control form-control-solid fs-8 border-primary ',
              )}
              aria-label="Select example"
              type="file"
              name="file"
              accept=".kmz, .kml"
              onChange={setImage}
            />
            <div className='fv-help-block text-muted mb-2 ps-4 fs-9 required '>
              <span>{step}</span>
            </div>
          </div>
          :
          null
        }


        <div className='border-primary mb-2'>
          <label className='fw-bold fs-6 mb-5'>Status LoP</label>
          {props.role === 'cckmdshMhcDluEEWVHNc' &&
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              onChange={(e) => { setStatus(e.target.value); setChange(true) }}
              value={status}
            >
              <option value="Aktif">Aktif</option>
              <option value="Drop">Drop</option>
            </select>
          }

          {props.role !== 'cckmdshMhcDluEEWVHNc' &&
            <input
              aria-label="Select example"
              type='text'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
              )}
              autoComplete='off'
              readOnly
              value={status}

            />
          }
        </div>
        {status === 'Drop' ?
          <div className='mb-7'>
            <label className='required fw-bold fs-6 mb-5'>Keterangan</label>
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
          :
          null
        }
      </div>
      <div className="modal-footer">
        {warning &&
          <div className='alert alert-muted d-flex'>
            <div className="spinner-border spinner-border-sm" role="status">
            </div>
            <div className='alert-text font-weight-bold ms-2 position-relative' style={{ top: "-2px" }}>loading...</div>
          </div>
        }
        {/* 
        <div>
          <button disabled onClick={onSubmit} type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button>
        </div> 
        */}
        {status === 'Drop' ?
          <>
            {keterangan === '' || keterangan === undefined ?
              <div>
                <button disabled onClick={onSubmit} type='submit' className='btn btn-primary'>
                  <span className='indicator-label'>Submit</span>
                </button>
              </div>
              :
              <>
                {step === 'Penanaman Tiang' || step === 'Pemasangan ODP' || step === 'Terminasi' || step === 'CT/UT' ?
                  <div>
                    {img === '' ?
                      <button disabled onClick={onSubmit} type='submit' className='btn btn-primary'>
                        <span className='indicator-label'>Submit</span>
                      </button>
                      :
                      <button onClick={onSubmit} type='submit' className='btn btn-primary'>
                        <span className='indicator-label'>Submit</span>
                      </button>
                    }
                  </div>
                  :
                  <div>
                    <button onClick={onSubmit} type='submit' className='btn btn-primary'>
                      <span className='indicator-label'>Submit</span>
                    </button>
                  </div>
                }
              </>
            }
          </>
          :
          <>
            {step === 'Penanaman Tiang' || step === 'Pemasangan ODP' || step === 'Terminasi' || step === 'CT/UT' ?
              <div>
                {img === '' ?
                  <button disabled onClick={onSubmit} type='submit' className='btn btn-primary'>
                    <span className='indicator-label'>Submit</span>
                  </button>
                  :
                  <button onClick={onSubmit} type='submit' className='btn btn-primary'>
                    <span className='indicator-label'>Submit</span>
                  </button>
                }
              </div>
              :
              <div>
                <button onClick={onSubmit} type='submit' className='btn btn-primary'>
                  <span className='indicator-label'>Submit</span>
                </button>
              </div>
            }
          </>
        }
        {/* {img !== '' || step !== '' || change === true ?
          <button onClick={onSubmit} type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button>
          :
          <button disabled onClick={onSubmit} type='submit' className='btn btn-primary'>
            <span className='indicator-label'>Submit</span>
          </button>
        } */}

      </div>
    </form>
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
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder'>Update LoP <span className='ms-3 fs-5 text-muted'>{nama_lop}</span> </h2>
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
              <ModalBody data={props.data} role={props.role} option={props.option} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ModalButtonUpdate = (props) => {
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
        role={props.role}
        option={props.option}
      />
    </>
  )
}

export { ModalButtonUpdate }

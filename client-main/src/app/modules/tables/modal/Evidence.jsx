import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../_metronic/helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'

const ModalEvidence = (props) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div onClick={() => setModalShow(true)} style={{ padding: "8px 10px" }} className='btn btn-light btn-active-light-primary btn-sm position-static'>
        <i className="bi bi-eye"></i>
      </div>

      <ModalUser
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={props.data}
      />
    </>
  )
}

const ModalUser = (props) => {
  const token = localStorage.getItem('token')
  const [post, setPost] = useState([])
  // const [file, setFile] = useState('')

  const src = `${process.env.REACT_APP_API_URL}construction/upload/`
  const url = `${process.env.REACT_APP_API_URL}construction/photo/`
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const body = {
    nama_lop: props.data.nama_lop,
  }

  const getCoordinate = async () => {
    // console.log('active', body)
    await axios.post(url, body, config)
      .then(res => {
        setPost(res.data)
        // const findFile = Array.from(res.data).find(value => value.step === 'Go Live')
        // setFile(findFile)
      })
      .catch(err => console.log('error', err))
  }

  const pilihan_1 = (value) => {
    return value.step === 'Aanwizing' || value.step === 'Perizinan' || value.step === 'MOS'
  }
  const pilihan_2 = (value) => {
    return value.step === 'Penanaman Tiang' || value.step === 'Penarikan Kabel' || value.step === 'Pemasangan ODP' || value.step === 'Terminasi' || value.step === 'CTUT'
  }
  const pilihan_3 = (value) => {
    return value.step === 'Go Live'
  }


  const preparing = Array.from(post).filter(pilihan_1)
  const construction = Array.from(post).filter(pilihan_2)
  const closing = Array.from(post).filter(pilihan_3)


  useEffect(() => {
    getCoordinate();
  }, [])

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
            <div className='modal-header' style={{ paddingBottom: "0px" }}>
              {/* begin::Modal title */}
              <div className='pb-8 pb-lg-15'>
                <h2 className='fw-bolder text-dark mb-1'>Evidence Collection</h2>
              </div>
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
              <div className="accordion" id="kt_accordion_1">
                {/* <div className="accordion-item">
									<h2 className="accordion-header" id="kt_accordion_1_header_1">
										<button className="accordion-button fs-4 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#kt_accordion_1_body_1" aria-expanded="true" aria-controls="kt_accordion_1_body_1">
											Preparing
										</button>
									</h2>
									<div id="kt_accordion_1_body_1" className="accordion-collapse collapse show" aria-labelledby="kt_accordion_1_header_1" data-bs-parent="#kt_accordion_1">
										<div style={{ height: '340px' }} className="accordion-body scroll-y">
											{Array.from(preparing).map((item, i) => {
												return (
													<div key={i} className='mx-auto mb-5' style={{ width: 'fit-content' }}>
														<p>{item.step}</p>
														<img style={{ height: '280px', maxWidth: '450px' }} className='rounded' alt={src + item.lokasi} src={src + item.lokasi} />
													</div>
												)
											})}
										</div>
									</div>
								</div> */}

                <div className="accordion-item">
                  <div id="kt_accordion_1_header_2">
                    <div className="border border-bottom-1 d-flex justify-content-between px-5 py-3 fs-4 fw-semibold">
                      <div className='card-toolbar pt-2'>Construction</div>
                      <div className='card-toolbar'>
                        {/* begin::Menu */}
                        {Array.from(closing).map((item, i) => {
                          return (
                            <button
                              type='button'
                              className='px-4 btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                              data-kt-menu-trigger='click'
                              data-kt-menu-placement='bottom-end'
                              data-kt-menu-flip='top-end'
                              style={{ width: 'fit-content' }}
                            >
                              <a download href={src + item.lokasi}>go live</a>
                            </button>
                          )
                        })}
                        {/* end::Menu */}
                      </div>
                    </div>
                  </div>
                  <div id="kt_accordion_1_body_2" className="accordion-collapse show" aria-labelledby="kt_accordion_1_header_2" data-bs-parent="#kt_accordion_2">
                    <div style={{ height: '340px' }} className="accordion-body scroll-y">
                      {Array.from(construction).map((item, i) => {
                        return (
                          <div key={i} className='mb-5' style={{ width: 'fit-content' }}>
                            <p>{item.step}</p>
                            <img style={{ height: '280px', maxWidth: '450px' }} className='rounded' alt={src + item.lokasi} src={src + item.lokasi} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* <div className="accordion-item">
                  <h2 className="accordion-header" id="kt_accordion_1_header_3">
                    <button className="accordion-button fs-4 fw-semibold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#kt_accordion_1_body_3" aria-expanded="false" aria-controls="kt_accordion_1_body_3">
                      Closing
                    </button>
                  </h2>
                  <div id="kt_accordion_1_body_3" className="accordion-collapse collapse" aria-labelledby="kt_accordion_1_header_3" data-bs-parent="#kt_accordion_1">
                    <div style={{ height: '340px' }} className="accordion-body scroll-y">
                      {Array.from(closing).map((item, i) => {
                        return (
                          <button
                            type='button'
                            className='px-4 btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                            data-kt-menu-trigger='click'
                            data-kt-menu-placement='bottom-end'
                            data-kt-menu-flip='top-end'
                            style={{ width: 'fit-content' }}
                          >
                            <a download href={src + item.lokasi}>go live</a>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { ModalEvidence }
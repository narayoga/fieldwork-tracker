import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../../helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'

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
              <h2 className='fw-bolder'>Delete </h2>
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
              <form id='kt_modal_add_user_form' className='form' noValidate>
                <p className='text-center' style={{ marginBottom: "0px" }}>
                  Are you sure want to delete <br />
                  {/* {props.name} ? */}
                </p>
                <div className='text-center pt-15'>
                  <button className='btn btn-light me-3'>
                    no
                  </button>
                  <button type='submit' className='btn btn-danger'>
                    <span className='indicator-label'>Delete</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ModalButtonDelete = (props) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <a className='text menu-link px-3' onClick={() => setModalShow(true)}>
        Delete
      </a>

      <ModalUser
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export { ModalButtonDelete }

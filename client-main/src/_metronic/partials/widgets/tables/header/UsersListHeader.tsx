import { KTSVG } from '../../../../helpers'
import { UsersListSearchComponent } from './UsersListSearchComponent'
import ModalButtonProject from '../modal/Planning/UsulanModal'

const UsersListHeader = () => {
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
      <div className='card-toolbar'>
        <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
          {/* <UsersListFilter /> */}

          {/* begin::Export */}
          {/* <button type='button' className='btn btn-light-primary me-3'>
            <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
            Export
          </button> */}
          {/* end::Export */}

          {/* begin::Add user */}
            <ModalButtonProject/>
          {/* end::Add user */}
        </div>
      </div>
    </div>
  )
}

export { UsersListHeader }

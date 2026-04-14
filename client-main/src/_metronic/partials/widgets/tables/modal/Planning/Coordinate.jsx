import { useEffect, useState } from 'react'
import { KTSVG } from '../../../../../helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'

const ModalBody = (props) => {
	const [warning, setWarning] = useState('')
	const [list, setList] = useState('')
	const token = localStorage.getItem('token')
	let count = 1

	const url = `${process.env.REACT_APP_API_URL}planning/odp/read/`
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const body = {
		nama_lop: props.data.nama_lop,
	}

	const getCoordinate = async () => {
		await axios.post(url, body, config)
			.then(res => {
				setWarning(res.data.message)
				setList(res.data)
			})
			.catch(err => console.log('error', err))
	}

	useEffect(() => {
		getCoordinate()
	}, [])

	return (
		<>
			<form id='kt_modal_add_user_form' className='form' noValidate>
				{/* begin::form */}
				{
					list.length === 0 ?
					<h3 className='text-muted'>no coordinate yet..</h3>
					:
					<></>
				}
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
					<div className='fv-row mb-7'>
						<div className='pe-4 overflow-auto' style={{ height: "500px" }}>
							{Array.from(list).map((item, i) => {
								return (
									<div key={i} className='d-flex justify-content-center'>
										<p style={{padding: "10px 5px"}} className='text-muted form-control-lg'>{count++}. </p>
										<p className='form-control form-control-lg' style={{ width: "80%" }}>
											{item.koordinat}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				</div>
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
								<h2 className='fw-bolder text-dark mb-1'>LoP Coordinate</h2>
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
							<ModalBody data={props.data} />
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

const ModalButtonCoordinate = (props) => {
	const [modalShow, setModalShow] = useState(false);
	const { data } = props
	return (
		<>
			<p onClick={() => setModalShow(true)}>
				{props.data.nama_lop}
			</p>

			<ModalUser
				show={modalShow}
				onHide={() => setModalShow(false)}
				data={data}
			/>
		</>
	)
}

export { ModalButtonCoordinate }


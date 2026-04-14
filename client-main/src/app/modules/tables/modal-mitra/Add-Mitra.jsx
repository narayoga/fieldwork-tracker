import { useEffect, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { KTSVG } from '../../../../_metronic/helpers'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'

const ModalUser = (props) => {
	const [subcon, setSubcon] = useState('')
	const [manpower, setManpower] = useState('')
	const [jointer, setJointer] = useState('')
	const [mandor, setMandor] = useState('')

	const [warning, setWarning] = useState('')
	const token = localStorage.getItem('token')

	//submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		setWarning('Loading...')
		const bodyUpdate = {
			subcon,
			manpower,
			jointer,
			mandor
		};
		const config = { headers: { Authorization: `Bearer ${token}` } };
		const url = `${process.env.REACT_APP_API_URL}mitra/`;
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
							<h2 className='fw-bolder'>Add Jumlah Personil </h2>
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
										<label className='required fw-bold fs-6 mb-2'>Nama Subcon</label>
										<input
											type='text'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={subcon}
											onChange={(e) => setSubcon(e.target.value)}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className='required fw-bold fs-6 mb-2'>Jumlah Man Power</label>
										<input
											type='text'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={manpower}
											onChange={(e) => setManpower(e.target.value)}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className=' required fw-bold fs-6 mb-2'>Jumlah Jointer</label>
										<input
											type='text'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={jointer}
											onChange={(e) => setJointer(e.target.value)}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className='required fw-bold fs-6 mb-2'>Jumlah Mandor</label>
										<input
											type='text'
											name='distribusi'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={mandor}
											onChange={(e) => setMandor(e.target.value)}
										/>
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

									{subcon === '' || manpower === '' || jointer === '' || mandor === '' ?
										<button disabled type='submit' className='btn btn-primary'>
											<span className='indicator-label'>Submit</span>
										</button> :
										<button onClick={handleSubmit} type='submit' className='btn btn-primary'>
											<span className='indicator-label'>Submit</span>
										</button>
									}
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
	const role = localStorage.getItem('code8uhx9')
	const [modalShow, setModalShow] = useState(false);
	return (
		<>
			{role === 'Ya1DGCVUDpd7UbKBjvUh' ?
				<button type="button"
					className="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#kt_modal_2"
					onClick={() => setModalShow(true)}
				>
					<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
					Add Jumlah Personil
				</button>
				:
				<button type="button"
					className="btn btn-secondary"
					data-bs-toggle="modal"
					data-bs-target="#kt_modal_2"
					onClick={() => setModalShow(true)}
					disabled
				>
					<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
					Add Jumlah Personil
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

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { KTSVG } from '../../../../_metronic/helpers'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'

const ModalUser = (props) => {
	const [lop, setLop] = useState('')
	const [date, setDate] = useState('')
	const [odp, setOdp] = useState('')
	const [distribusi, setDistribusi] = useState('')

  const [option,setOption] = useState([])
	const [warning, setWarning] = useState('')
	const token = localStorage.getItem('token')

	//select option
  const getLive = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}construction/read/`;
    await axios.post(url, body, config)
      .then(res => {
        let findLive = res.data.filter(value => value.closing === "Go Live")
        let exactValue = findLive.map(value => value.nama_lop)
        setOption(exactValue) 
      })
      .catch(err => console.log(err))
  }
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
			nama_lop: lop, 
			nama_odp: odp,
			tgl_golive: date, 
			distribusi
		};
		const config = { headers: { Authorization: `Bearer ${token}` } };
		const url = `${process.env.REACT_APP_API_URL}odp/`;
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
	useEffect(() => {
    getLive()
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
									<div className='mb-2'>
										<label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
										<Select className=''
											styles={costumStyle}
											onChange={handleChange}
										  options={options}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className='required fw-bold fs-6 mb-2'>Tanggal Go Live</label>
										<input
											type='date'
											name='date'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={date}
											onChange={(e) => setDate(e.target.value)}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className='required fw-bold fs-6 mb-2'>Nama ODP</label>
										<input
											type='text'
											name='odp'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={odp}
											onChange={(e) => setOdp(e.target.value)}
										/>
									</div>

									<div className='fv-row mb-2'>
										<label className='required fw-bold fs-6 mb-2'>Distribusi</label>
										<input
											type='text'
											name='distribusi'
											className={clsx(
												'form-control form-control-solid mb-3 mb-lg-0',
											)}
											autoComplete='off'
											value={distribusi}
											onChange={(e) => setDistribusi(e.target.value)}
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

									{lop === '' || date === '' || odp === '' || distribusi === '' ?
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
	const [modalShow, setModalShow] = useState(false);
	return (
		<>
			<button type="button"
				className="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target="#kt_modal_2"
				onClick={() => setModalShow(true)}
			>
				<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
				Add ODP Go Live
			</button>
			<ModalUser
				show={modalShow}
				onHide={() => setModalShow(false)}
				option={props.option}
			/>
		</>
	)
}

export default ModalButtonProject

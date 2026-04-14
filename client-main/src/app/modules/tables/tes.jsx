import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KTSVG } from '../../../_metronic/helpers'
import clsx from 'clsx'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { ModalButtonAdd } from '../../../_metronic/partials/widgets/tables/modal/Planning/Update-Usulan'
import { ModalButtonEdit } from '../../../_metronic/partials/widgets/tables/modal/Planning/Edit'
import { UsersListHeader } from '../../../_metronic/partials/widgets/tables/header/UsersListHeader'
import { KTCard } from '../../../_metronic/helpers'
import { Field, ErrorMessage } from 'formik'
import Dropdown from 'react-bootstrap/Dropdown';
import OptionSto from '../../../_metronic/partials/widgets/tables/json/sto.json'
import Select from 'react-select'

const Test = () => {
  const [list, setList] = useState([
    {
      id: 1,
      value: ""
    },
    {
      id: 2,
      value: ""
    },
    {
      id: 3,
      value: ""
    }
  ])

  const [willsend, setWillsend] = useState([])

  const addHandle = (e) => {
    e.preventDefault()
    let data = [...list]
    data.push({ id: data.length + 1, value: "" })
    setList(data)
  }
  const deleteHandle = (e, val) => {
    e.preventDefault()
    let data = [...list]
    data = data.filter(item => item.id !== val)
    return setList(data)
  }
  const print = () => {
    console.log(willsend)
  }

  return (
    <>
      <div className='float-end mt-2'>
        <button className='btn btn-primary me-5' onClick={(e) => { addHandle(e) }}>add</button>
        <button className='btn btn-secondary' onClick={print}>print</button>
      </div>
      {list.map((item) => {
        return (
          <>
            <div key={item.id} className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>Name</label>
              <input
                required
                aria-label="Select example"
                type='text'
                name='name'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                )}
                autoComplete='off'
                value={willsend}
                onChange={(e) => setWillsend(...e.target.value)}

              />
            </div>
            <button onClick={(e) => { deleteHandle(e, item.id) }} className='btn btn-danger'>delete</button>
          </>
        )
      })}
    </>
  )
}

const Test2 = () => {
  const [list, setList] = useState([
    {
      name: "OSP122-GSA-PSW SiDOARJO",
      location: ["0.36, 109.17", "0.34, 111.12", "1.26, 78.11"],
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

  const addHandle = (e) => {
    e.preventDefault()
    let data = [...list]
    data.push({ name: additem, location: locolection })
    setList(data)
    setAdditem('')
    setLocolection('')
  }

  const deleteHandle = (e, name) => {
    e.preventDefault()
    let data = [...locolection]
    data = data.filter(item => item !== name)
    return setLocolection(data)
  }

  const print = (e) => {
    console.log("list", list)
    console.log("locolect", locolection)
  }

  // useEffect(() => {
  //     console.log(list[0].location)
  // }, [])
  return (
    <>
      <div className='fv-row mb-7'>
        <label className='required fw-bold fs-6 mb-2'>Project</label>
        <input
          required
          aria-label="Select example"
          type='text'
          name='name'
          className={clsx(
            'form-control form-control-solid mb-3 mb-lg-0',
          )}
          autoComplete='off'
          value={additem}
          onChange={(e) => setAdditem(e.target.value)}
          style={{ width: "60%" }}

        />
        <label className='required fw-bold fs-6 mb-2'>location</label>
        <input
          required
          aria-label="Select example"
          type='text'
          name='loc'
          className={clsx(
            'form-control form-control-solid mb-3 mb-lg-0',
          )}
          autoComplete='off'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "60%" }}

        />
        <div className='mt-2'>
          <button className='btn btn-secondary me-5' onClick={(e) => { addLoco(e) }}>add location</button>
          <button className='btn btn-primary me-5' onClick={(e) => { addHandle(e) }}>submit</button>
          {/* <button className='btn btn-info' onClick={print}>print</button> */}
        </div>
        <div className='mt-5 p-4 border border-primary' style={{ width: "60%" }}>
          <h3 className='fw-light badge badge-success'>READY</h3>
          <div className='mt-4'>location: </div>
          <ul >
            {Array.from(locolection).map((loc, i) => {
              return (
                <li key={i}>{loc} <span onClick={(e) => { deleteHandle(e, loc) }} className='text-danger cursor-pointer'>delete</span></li>
              )
            })}
          </ul>
        </div>
      </div>
      <div>
        <h3>DATABASE</h3>
        {list.map((item, i) => {
          return (
            <div key={i} className='border border-primary' style={{ width: "60%" }}>
              <div className='d-flex'>
                <p className='me-2'>name: </p><span className='fw-bold'>{item.name}</span>
              </div>
              <p className='me-2'>Location: </p>
              <ul>
                {list[i].location.map((item, i) => {
                  return (
                    <li key={i}>{item} </li>
                  )
                })}
              </ul>
            </div>
          )
        })
        }
      </div>
    </>
  )
}

const App = () => {
  const [value, setValue] = useState("");
  const [tab, setTab] = useState(false)

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    // our api to fetch the search result
    console.log("search ", searchTerm);
  };

  const styleSelect = {
    height: '100px',
    position: 'absolute',
    backgroundColor: '#c3c6cc',
    zIndex: 1
  }

  const data = [
    { "full_name": "Farrel Hoggin" },
    { "full_name": "Irma Olech" },
    { "full_name": "Emmit Gallacher" },
    { "full_name": "Dunn Astlet" },
    { "full_name": "Burg Peaddie" },
    { "full_name": "Molli Knoller" },
    { "full_name": "Ellen Cheak" },
    { "full_name": "Kaela Hannibal" },
    { "full_name": "Roxanna Mughal" },
    { "full_name": "Sharona Robberts" },
    { "full_name": "Tybie Dudding" },
  ]

  return (
    <div className="App" onClick={() => { setTab(prevTab => !prevTab) }} >
      <h1>Search</h1>

      <div className="search-container">
        <div className="search-inner">
          <input placeholder='search' className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid" type="text" value={value} onClick={() => { setTab(prevTab => !prevTab) }} onChange={onChange} />
          {tab &&
            <div style={styleSelect} className="scroll-y">
              {data
                .filter((item) => {
                  const searchTerm = value.toLowerCase();
                  const fullName = item.full_name.toLowerCase();

                  return (
                    fullName.startsWith(searchTerm) &&
                    fullName !== searchTerm
                  );
                })
                .map((item) => (
                  <div
                    onClick={() => onSearch(item.full_name)}
                    className="dropdown-row"
                    key={item.full_name}
                  >
                    {item.full_name}
                  </div>
                ))}
            </div>
          }
        </div>

      </div>
      <div className='mb-2'>
        <label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
        <select
          className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
          aria-label="Select example"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option defaultValue=''></option>
          {data.map((item, i) => {
            return (
              <option key={i} value={item.full_name}>{item.full_name}</option>
            )
          })}
        </select>
      </div>
    </div>
  );
}

const SelectInput = () => {
  const [lop, setLop] = useState('')
  const handleChange = (selected) => {
    setLop(selected.value)
    console.log('option selected', lop)
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
      backgroundColor: '#f5f8fa'
    })
  }
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  return (
    <>
      <div className='mb-2'>
        <label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
        <Select className='mb-3 mb-lg-0 form-control form-control-lg form-control-solid'
          styles={costumStyle}
          onChange={handleChange}
          options={options}
        />
      </div>
      <div className='mb-2'>
        <label className='required fw-bold fs-6 mb-5'>Nama LoP</label>
        <select
          className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
          aria-label="Select example"
          value={lop}
          onChange={(e) => setLop(e.target.value)}
        >
          <option defaultValue=''></option>
          {options.map((item, i) => {
            return (
              <option key={i} value={item.value}>{item.value}</option>
            )
          })}
        </select>
      </div>
      <button onClick={() => { console.log(lop) }} className='btn btn-primary'>print</button>
    </>
  )
}

const Filter = () => {
  const token = localStorage.getItem('token')
  const [posts, setPosts] = useState([])
  const [display, setDisplay] = useState([])
  const [lop, setLop] = useState('')
  const [status, setStatus] = useState('')

  const filter = (param, param2) => {
    const result = posts.filter((item) => {
      if (param === '') {
        return result
      } else if (param2 !== '' && param !== '') {
        return item.status_microdemand === param && item.status_lop === param2
      } else {
        return item.status_microdemand === param || item.status_lop === param2
      }
    })
    setDisplay(result)
  }

  const getItem = async () => {
    const body = { page: "1" }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = `${process.env.REACT_APP_API_URL}planning/read/`;
    await axios.post(url, body, config)
      .then(res => {
        if (res.data instanceof Array) {
          setPosts(res.data)
          setDisplay(res.data)
          console.log('gak warning')
          return
        }
        console.log('warning')
        console.log(res)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getItem()
  }, [])
  return (
    <>
      <a
        href='#'
        className='btn btn-sm btn-flex btn-light btn-active-primary fw-bolder'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
        data-kt-menu-flip='top-end'
      >
        <KTSVG
          path='/media/icons/duotune/general/gen031.svg'
          className='svg-icon-5 svg-icon-gray-500 me-1'
        />
        Filter
      </a>
      <div className='menu menu-sub menu-sub-dropdown w-300px w-md-350px' data-kt-menu='true'>
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
        </div>

        <div className='separator border-gray-200'></div>

        <div className='px-7 py-5'>

          <div className='mb-10'>
            <label className='form-label fw-bold'>Micro Demand:</label>
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              onChange={(e) => { filter(e.target.value, status); setLop(e.target.value) }}
            >
              <option value=''></option>
              <option value='On Going'>On Going</option>
              <option value='Rejected'>Rejected</option>
              <option value='Approved'>Approved</option>
            </select>

            {/* <div className='d-flex'>
              <label className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                <input className='form-check-input' type='checkbox' value='On Going' defaultChecked={true} onClick={() => filter('On Going')} />
                <span className='form-check-label'>On Going</span>
              </label>

              <label className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                <input className='form-check-input' type='checkbox' value='Rejected' defaultChecked={true} />
                <span className='form-check-label'>Rejected</span>
              </label>

              <label className='form-check form-check-sm form-check-custom form-check-solid'>
                <input className='form-check-input' type='checkbox' value='Approved' defaultChecked={true} />
                <span className='form-check-label'>Approved</span>
              </label>
            </div> */}
          </div>
          <div className='mb-10'>
            <label className='form-label fw-bold'>Status LoP:</label>
            <select
              className="mb-3 mb-lg-0 form-select form-control form-control-lg form-control-solid"
              aria-label="Select example"
              onChange={(e) => { filter(lop, e.target.value); setStatus(e.target.value) }}
            >
              <option value=''></option>
              <option value='Go'>Go</option>
              <option value='No Go'>No Go</option>
            </select>
          </div>

          {/* <div className='mb-10'>
            <label className='form-label fw-bold'>LoP Status:</label>

            <div className='d-flex'>
              <label className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                <input className='form-check-input' type='checkbox' value='Go' />
                <span className='form-check-label'>Go</span>
              </label>

              <label className='form-check form-check-sm form-check-custom form-check-solid'>
                <input className='form-check-input' type='checkbox' value='No Go' defaultChecked={true} />
                <span className='form-check-label'>No Go</span>
              </label>
            </div>
          </div> */}

        </div>
      </div>
      <KTCard>
        <div className='card-body py-4'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table id="kt_table_users" className="table table-rounded table-striped border gy-7 gs-7" role="table">
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bolder text-start text-uppercase'>
                  <th className='text-center' role={"columnheader"} >Project</th>
                  <th className='text-center' role={"columnheader"} >Tahun</th>
                  <th className='text-center' role={"columnheader"} >STO</th>
                  <th className='required text-center' role={"columnheader"} >Nama LoP</th>
                  <th className='text-center' role={"columnheader"} >Status Microdemand</th>
                  <th className='text-center' role={"columnheader"}  >Status LoP</th>
                </tr>
              </thead>
              <tbody className='text-center text-gray-600 fw-bold' role={"rowgroup"}>
                {Array.from(display).map((item, i) => {
                  return (
                    <tr key={i} role={"row"}>
                      <td className='text-center fw-normal' role={"cell"}>
                        {item.project}
                      </td>
                      <td className='text-center fw-normal' role={"cell"}>
                        {item.tahun}
                      </td>
                      <td className='text-center fw-normal' role={"cell"}>
                        {item.sto}
                      </td>
                      <td className='text-hover-primary text-start fw-normal' role={"button"}>
                        {item.nama_lop}
                      </td>
                      <td className='text-center fw-normal' role={"cell"}>
                        {item.status_microdemand == 'Approved' &&
                          <span className='badge badge-light-success'>{item.status_microdemand}</span>
                        }
                        {item.status_microdemand == 'Rejected' &&
                          <span className='badge badge-light-danger'>{item.status_microdemand}</span>
                        }
                        {item.status_microdemand == 'On Going' &&
                          <span className='badge badge-light-warning'>{item.status_microdemand}</span>
                        }
                        {item.status_microdemand == 'Blank' &&
                          <span>{item.status_microdemand}</span>
                        }
                      </td>
                      <td className='text-center fw-normal' role={"cell"}>
                        {item.status_lop}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </KTCard>
    </>
  )
}
export default Filter

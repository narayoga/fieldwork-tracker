/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useContext, useEffect } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, login } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import axios from 'axios'
import { AppsContext } from '../../../routing/AppRoutes'

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  username: Yup.string()
    .required('Username required')
})

const initialValues = {
  username: '',
  password: '',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  // const  {setApps}  = useContext(AppsContext);
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      const url = `${process.env.REACT_APP_API_URL}login/`;
      const body = {
        username: values.username,
        password: values.password
      }
      axios.post(url, body)
        .then(res => {
          if (res.data.message === "Incorrect username or password") {
            setStatus("Incorrect username or password")
            setLoading(false)
          } else {
            if(res.data.role === 'Optima'){
              localStorage.setItem('code8uhx9', 'cckmdshMhcDluEEWVHNc')
            }else if(res.data.role === 'Mitra'){
              localStorage.setItem('code8uhx9', 'Ya1DGCVUDpd7UbKBjvUh')
            }else if(res.data.role === 'Hero'){
              localStorage.setItem('code8uhx9', 'yEOvDqwjIuGc0jjvBdpm')
            }else{
              localStorage.setItem('code8uhx9', 'AuioG87YsdHSn7LoCS')
            }
            const newData = {
              username: res.data.username,
              role: res.data.role,
              handphone: res.data.handphone,
              message: res.data.message
            }
            localStorage.setItem('token', res.data.accessToken)
            localStorage.setItem('auth', JSON.stringify(res.data))
            // setApps(newData)
            navigate('/dashboard')
            setCurrentUser(res.data)
          }
        })
        .catch(err => {
          setStatus('internal server error')
          setSubmitting(false)
          setLoading(false)
          console.log(err.message, err.response)
        })
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Sign In to PAS</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          New Here?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Create an Account
          </Link>
        </div>
      </div>
      {/* begin::Heading */}
      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div></div>
      )}
      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
        <input
          placeholder='username'
          {...formik.getFieldProps('username')} //inital value
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.username && formik.errors.username },
            {
              'is-valid': formik.touched.username && !formik.errors.username,
            }
          )}
          type='text'
          name='username'
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.username}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            {/* begin::Label */}
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
            {/* end::Label */}
            {/* begin::Link */}
            {/* end::Link */}
          </div>
        </div>
        <input
        placeholder='password'
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  )
}

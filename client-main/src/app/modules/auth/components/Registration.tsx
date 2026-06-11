/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { getUserByToken, register } from '../core/_requests'
import { Link, Navigate } from 'react-router-dom'
import { PasswordMeterComponent } from '../../../../_metronic/assets/ts/components'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  username: '',
  phone: '',
  role: '',
  password: '',
  changepassword: '',
}

const registrationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('username is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(3, 'Minimum 6 digits')
    .max(50, 'Maximum 50 digits')
    .required('Phone is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    })
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const [role,setRole] = useState('')
  const { saveAuth, setCurrentUser } = useAuth()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await register(
          values.username,
          values.phone,
          role,
          values.password,
        )
        saveAuth(auth)
        console.log(auth.message)
        if (auth.message === 'Username sudah terdaftar!') {
          setStatus('user already taken')
        } else {
          navigate('/auth')
        }
        // const { data: user } = await getUserByToken(auth.api_token)
        // setCurrentUser(user)
        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        console.log(error, values)
        saveAuth(undefined)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework crm-auth-form' noValidate id='kt_login_signup_form' onSubmit={formik.handleSubmit}>
      {/* Brand — logo + login link */}
      <div className='crm-auth-brand'>
        <img alt='Logo' src={toAbsoluteUrl('/media/logos/pas.png')} className='crm-auth-logo' />
        <div className='crm-auth-signup'>
          Already have an account?{' '}
          <Link to='/auth/login' className='crm-auth-signup-link'>
            Login
          </Link>
        </div>
      </div>

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group username */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Username</label>
        <input
          placeholder='Username'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('username')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.username && formik.errors.username },
            { 'is-valid': formik.touched.username && !formik.errors.username }
          )}
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.username}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group username*/}

      {/* begin::Form group phone */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Phone</label>
        <input
          placeholder='Phone'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('phone')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.phone && formik.errors.phone },
            { 'is-valid': formik.touched.phone && !formik.errors.phone }
          )}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.phone}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group phone */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Role</label>
        <select className="form-select form-control form-control-lg form-control-solid" aria-label="Select example" onChange={(e) => setRole(e.target.value)}>
          <option defaultValue="HS/CS">HS/CS</option>
          <option value="Hero">Hero</option>
          <option value="Optima">Optima</option>
          <option value="Mitra">Mitra</option>
        </select>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='mb-10 fv-row' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
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
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Form group */}
    </form>
  )
}

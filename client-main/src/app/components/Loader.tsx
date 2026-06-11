import { FC } from 'react'

type Props = {
  minHeight?: number | string
  label?: string
}

/**
 * Centered spinner used while a component is fetching its data.
 * Drop inside a <td colSpan={n}> for table bodies, or anywhere needing a loader.
 */
const Loader: FC<Props> = ({ minHeight = 220, label = 'Memuat data...' }) => (
  <div className='d-flex flex-column flex-center w-100' style={{ minHeight }}>
    <span
      className='spinner-border text-primary'
      role='status'
      style={{ width: '2.75rem', height: '2.75rem', borderWidth: '3px' }}
    />
    <span className='text-muted fw-semibold fs-6 mt-4'>{label}</span>
  </div>
)

export { Loader }

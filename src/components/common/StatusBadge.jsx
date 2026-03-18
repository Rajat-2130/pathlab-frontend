import { getStatusBadgeClass, getStatusIcon } from '../../utils/helpers'

const StatusBadge = ({ status }) => {
  return (
    <span className={getStatusBadgeClass(status)}>
      <span>{getStatusIcon(status)}</span>
      {status}
    </span>
  )
}

export default StatusBadge

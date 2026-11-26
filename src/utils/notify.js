import { toast } from 'react-toastify';

export const NOTIFY_DURATION = 2000;

const options = { autoClose: NOTIFY_DURATION };

export const notify = {
  success: (message) => toast.success(message, options),
  error: (message) => toast.error(message, options),
  info: (message) => toast.info(message, options),
  warning: (message) => toast.warning(message, options),
};

export default notify;

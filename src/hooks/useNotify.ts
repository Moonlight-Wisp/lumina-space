import { toast } from 'react-hot-toast';

export function useNotify() {
  return {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast(msg),
    custom: toast,
  };
}

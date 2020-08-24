import OriginModal from './Modal';

export { ModalProps } from './Modal';

type Modal = typeof OriginModal & { destroyAll: () => void };
const Modal = OriginModal as Modal;

export default Modal;

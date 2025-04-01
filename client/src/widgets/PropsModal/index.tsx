import {Modal} from 'antd';

interface Props {
  close: () => void;
}

export const PropsModal = ({close}: Props) => (
  <Modal open={true} onOk={close} onCancel={close}>
    Свойства ноды
  </Modal>
);

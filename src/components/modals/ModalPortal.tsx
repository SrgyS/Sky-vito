import ReactDOM from 'react-dom'

export enum PortalTarget {
  PORTAL = 'portal',
  ROOT = 'root',
}

type Props = {
  children: React.ReactNode
  target: string
}

const ModalPortal = ({ children, target }: Props) => {
  const domElement = document.getElementById(target)

  return domElement ? ReactDOM.createPortal(children, domElement) : null
}

export default ModalPortal

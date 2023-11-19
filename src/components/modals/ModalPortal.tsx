import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

type Props = {
  children: React.ReactNode
}

const ModalPortal = ({ children }: Props) => {
  const domElement = document.getElementById('portal')

  return domElement ? ReactDOM.createPortal(children, domElement) : null
}

export default ModalPortal

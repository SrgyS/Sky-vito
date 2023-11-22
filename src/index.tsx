import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'styles/globalStyles.css'
import { store } from 'store/store'
import { BrowserRouter } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SkeletonTheme baseColor="#f0f0f0" highlightColor="#c1e7f7">
          <App />
        </SkeletonTheme>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)

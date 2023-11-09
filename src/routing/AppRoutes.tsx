import Auth from 'components/Auth/Auth'
import AdvPage from 'pages/AdvPage/AdvPage'
import MainPage from 'pages/MainPage/MainPage'
import ProfilePage from 'pages/ProfilePage/ProfilePage'
import SellerProfilePage from 'pages/SellerProfilePage/SellerProfilePage'
import { Routes, Route } from 'react-router-dom'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/ads/:id" element={<AdvPage />} />
      <Route path="/seller/:id" element={<SellerProfilePage />} />
      <Route path="/signin" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/user/:id" element={<ProfilePage />} />

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

export default AppRoutes

import Auth from 'components/Auth/Auth'
import AdvPage from 'pages/AdvPage/AdvPage'
import MainPage from 'pages/MainPage/MainPage'
import ProfilePage from 'pages/ProfilePage/ProfilePage'
import SellerProfilePage from 'pages/SellerProfilePage/SellerProfilePage'
import { Routes, Route, useParams } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { setTokens } from 'store/slices/authSlice'
import { useEffect } from 'react'
import { selectTokens } from 'store/selectors/selectors'
import { useGetUserQuery } from 'store/services/advApi'

function AppRoutes() {
  const tokens = useAppSelector(selectTokens)

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/ads/:id" element={<AdvPage />} />
      <Route path="/seller/:id" element={<SellerProfilePage />} />
      <Route path="/signin" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route element={<ProtectedRoute isAllowed={Boolean(tokens)} />}>
        <Route path="/user/:id" element={<ProfilePage />} />
        <Route path="/user/ads/:id" element={<AdvPage />} />
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

export default AppRoutes

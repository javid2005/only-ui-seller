import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }      from '@/components/layout/Layout'
import { Dashboard }   from '@/pages/Dashboard'
import { Settings }    from '@/pages/Settings'
import { GeneralInfo } from '@/pages/settings/GeneralInfo'
import { Categories }  from '@/pages/settings/Categories'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/store-info" element={<GeneralInfo />} />
          <Route path="settings/categories" element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

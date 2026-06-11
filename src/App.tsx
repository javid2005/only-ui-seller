import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }      from '@/components/layout/Layout'
import { Dashboard }   from '@/pages/Dashboard'
import { Settings }    from '@/pages/Settings'
import { GeneralInfo }    from '@/pages/settings/GeneralInfo'
import { Categories }     from '@/pages/settings/Categories'
import { SalesSettings }    from '@/pages/settings/SalesSettings'
import { ShippingSettings }    from '@/pages/settings/ShippingSettings'
import { AddShippingMethod }  from '@/pages/settings/AddShippingMethod'
import { ThemeSettings }      from '@/pages/settings/ThemeSettings'
import { ThemeCustomize }    from '@/pages/settings/ThemeCustomize'
import { Badges }            from '@/pages/settings/Badges'
import { ProductCategories } from '@/pages/products/Categories'
import { ProductList }       from '@/pages/products/ProductList'
import { Reviews }           from '@/pages/products/Reviews'
import { UserInfo }          from '@/pages/account/UserInfo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="account/user-info" element={<UserInfo />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/store-info" element={<GeneralInfo />} />
          <Route path="settings/categories" element={<Categories />} />
          <Route path="settings/sales"     element={<SalesSettings />} />
          <Route path="settings/shipping"     element={<ShippingSettings />} />
          <Route path="settings/shipping/add" element={<AddShippingMethod />} />
          <Route path="settings/themes"           element={<ThemeSettings />} />
          <Route path="settings/themes/customize" element={<ThemeCustomize />} />
          <Route path="settings/badges"           element={<Badges />} />
          <Route path="products/list"              element={<ProductList />} />
          <Route path="products/categories"       element={<ProductCategories />} />
          <Route path="products/reviews"          element={<Reviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

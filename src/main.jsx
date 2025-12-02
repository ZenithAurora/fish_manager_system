import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { unstableSetRender } from 'antd-mobile'
import './styles/global.scss'
import router from './router'

// React 19 兼容配置
unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container)
  const root = container._reactRoot
  root.render(node)
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    root.unmount()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
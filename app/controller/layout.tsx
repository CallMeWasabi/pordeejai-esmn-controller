import React from 'react'
import Sider from './Sider'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex w-full'>
      <Sider />
      {children}
    </div>
  )
}

export default layout

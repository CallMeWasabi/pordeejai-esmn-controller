"use client"
import { Button } from '@nextui-org/react'
import React from 'react'
import AddTableModal from './AddTableModal'
import ConfigTableModal from './ConfigTableModal'
import DeleteTableModal from './DeleteTableModal'
import AddMenuModal from './AddMenuModal'

const page = () => {
  return (
    <div className='flex flex-col p-5 space-y-3'>
      <h3 className='text-2xl font-bold mb-5'>การตั้งค่า</h3>
      <div className='flex flex-col space-y-3'>
        <h3>ตั้งค่า โต๊ะ</h3>
        <div className='flex space-x-2'>
          <AddTableModal />
          <ConfigTableModal />
          <DeleteTableModal />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <h3>ตั้งค่า ประเภทอาหาร</h3>
        <div className='flex space-x-3'>
          <AddMenuModal />
          <Button color='warning'>แก้ไข</Button>
          <Button color='danger'>ลบ</Button>
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <h3>ตั้งค่า อาหาร</h3>
        <div className='flex space-x-3'>
          <AddMenuModal />
          <Button color='warning'>แก้ไข</Button>
          <Button color='danger'>ลบ</Button>
        </div>
      </div>
    </div>
  )
}

export default page

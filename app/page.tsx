import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='h-screen w-screen flex justify-center items-center'>
      <Button color='primary' as={Link} href='/login'>เริ่มต้นการใช้งาน</Button>
    </main>
  )
}

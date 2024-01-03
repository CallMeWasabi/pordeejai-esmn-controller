import React from 'react'
import { Card, CardBody, CardHeader} from "@nextui-org/react";
import { TableQuery } from './page';
import { RiBaseStationLine } from "react-icons/ri";
import { IconContext } from 'react-icons';



const StatusCard = ({ rows }: { rows: TableQuery[] }) => {
  const openingTable = rows.filter((table) => {
    if (table.status === "OPEN") {
      return true
    }
    return false
  }) 
  const inserviceTable =  rows.filter((table) => {
    if (table.status === "IN_SERVICE") {
      return true
    }
    return false
  })
  const closingTable = rows.filter((table) => {
    if (table.status === "CLOSE") {
      return true
    }
    return false
  })
  return (
    <div className="flex space-x-3 ">
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex gap-3">
            <div className="flex items-center space-x-2">
              <IconContext.Provider value={{ size: "40px" }}>
                <div className='text-emerald-500'>
                  <RiBaseStationLine />
                </div>
              </IconContext.Provider>
              <p className="font-bold text-xl">โต๊ะที่ว่างอยู่</p>
            </div>
          </CardHeader>
          <CardBody className='flex justify-end'>
            <h3 className='text-2xl font-bold flex justify-end'>{openingTable.length} ที่ว่าง</h3>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex gap-3">
            <div className="flex items-center space-x-2">
              <IconContext.Provider value={{ size: "40px" }}>
                <div className='text-yellow-500'>
                  <RiBaseStationLine />
                </div>
              </IconContext.Provider>
              <p className="font-bold text-xl">โต๊ะที่มีการใช้งาน</p>
            </div>
          </CardHeader>
          <CardBody>
            <h3 className='text-2xl font-bold flex justify-end'>{inserviceTable.length} กำลังให้บริการ</h3>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex gap-3">
            <div className="flex items-center space-x-2">
              <IconContext.Provider value={{ size: "40px" }}>
                <div className='text-red-500'>
                  <RiBaseStationLine />
                </div>
              </IconContext.Provider>
              <p className="font-bold text-xl">โต๊ะที่ปิดการใช้งาน</p>
            </div>
          </CardHeader>
          <CardBody>
            <h3 className='text-2xl font-bold flex justify-end'>{closingTable.length} ปิดใช้งานอยู่</h3>
          </CardBody>
        </Card>
      </div>
  )
}

export default StatusCard

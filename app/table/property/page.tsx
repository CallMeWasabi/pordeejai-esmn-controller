"use server";
import { Chip } from "@nextui-org/react";
import axios from "axios";
import React from "react";
import { TableQuery } from "../page";
import EditButton from "./EditButton";

const convertThaiDate = (date: Date) => {
  const result = new Date(date);
  return result.toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "medium",
  });
};

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const id = searchParams["id"];
  const res = await axios.get(`${process.env.WEBSERVER_URL}/api/tables/${id}`);
  const table: TableQuery = res.data;

  const statusSelected = (status: string) => {
    if (status === "OPEN") {
      return (
        <Chip color="success" variant="flat">
          ว่าง
        </Chip>
      );
    } else if (status === "IN_SERVICE") {
      return (
        <Chip color="warning" variant="flat">
          กำลังให้บริการ
        </Chip>
      );
    } else if (status === "CLOSE") {
      return (
        <Chip color="danger" variant="flat">
          ปิดการใช้งาน
        </Chip>
      );
    } else {
      return (
        <Chip color="danger" variant="flat">
          เกิดข้อผิดพลาด
        </Chip>
      );
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <h3 className="font-bold text-2xl">รายละเอียด</h3>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ไอดี</p>
        <p>{table.id}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">สถานะ</p>
        {statusSelected(table.status)}
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ชื่อโต๊ะ</p>
        <p>{table.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ยูไอดี</p>
        <p>{table.uuid}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">สร้างเมื่อ</p>
        <p>{convertThaiDate(table.created_at)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">แก้ไขล่าสุด</p>
        <p>{convertThaiDate(table.updated_at)}</p>
      </div>
      <EditButton table={table}/>
    </div>
  );
};

export default Page;

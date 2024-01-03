"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IoIosCafe } from "react-icons/io";

const Sider = () => {
  const pathname = usePathname();
  const features = [
    { href: "/home", label: "หน้าหลัก" },
    { href: "/incomming", label: "รายการอาหารที่เข้ามาขณะนี้" },
    { href: "/table", label: "จัดการโต๊ะและดูรายการสั่ง" },
    { href: "/menu", label: "จัดการประเภทและเมนู"},
    { href: "/option", label: "จัดการตัวเลือก"},
    { href: "/networth", label: "รายได้" },
    { href: "/setting", label: "การตั้งค่า"}
  ];

  return (
    <div className="flex flex-col h-screen w-[256px] border p-5">
      <h3 className="mb-5 font-bold flex space-x-2 items-center">
        <IoIosCafe />
        <p>Pordeejai manager</p>
      </h3>
      <ul className="space-y-2">
        {features.map((f, key) => {
          return (
            <Button
              key={key}
              as={Link}
              href={f.href}
              className="w-full flex justify-start"
              color={pathname.includes(f.href) ? "primary" : "default"}
              variant="light"
            >
              {f.label}
            </Button>
          );
        })}
      </ul>
    </div>
  );
};

export default Sider;

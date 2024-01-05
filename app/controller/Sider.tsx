"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { IoIosCafe } from "react-icons/io";
import { deleteToken } from "./home/serverAction";

const Sider = () => {
  const pathname = usePathname();
  const router = useRouter();

  const features = [
    { href: "/controller/home", label: "หน้าหลัก" },
    { href: "/controller/incomming", label: "รายการอาหารที่เข้ามาขณะนี้" },
    { href: "/controller/table", label: "จัดการโต๊ะและดูรายการสั่ง" },
    { href: "/controller/menu", label: "จัดการประเภทและเมนู" },
    { href: "/controller/option", label: "จัดการตัวเลือก" },
    { href: "/controller/networth", label: "รายได้" },
    // { href: "/controller/setting", label: "การตั้งค่า"}
  ];

  const logOut = async () => {
    await deleteToken();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-[256px] border p-5">
      <h3 className="mb-5 font-bold flex space-x-2 items-center">
        <IoIosCafe />
        <p>Pordeejai manager</p>
      </h3>
      <ul className="space-y-2">
        <Dropdown>
          <DropdownTrigger>
            <User name="admin" description="ผู้จักการ" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              className="text-danger"
              color="danger"
              onClick={logOut}
            >
              ออกจากระบบ
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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

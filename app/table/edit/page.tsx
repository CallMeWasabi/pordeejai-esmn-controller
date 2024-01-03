"use client";
import { BreadcrumbItem, Breadcrumbs, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-5 flex flex-col space-y-2">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/table"}>
            <p className="text-2xl font-bold">จัดการโต๊ะ</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="text-2xl font-bold">แก้ไขโต๊ะ</p>
        </BreadcrumbItem>
      </Breadcrumbs>
    
    </div>
  );
};

export default page;

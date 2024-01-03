"use client";
import { BreadcrumbItem, Breadcrumbs, Input, Button } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createTable } from "./serverAction";

const Page = () => {
  const router = useRouter();
  const [tableName, setTableName] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  const serverAction = async () => {
    const response = await createTable(tableName);
    if (response.status === 200) {
      toast.success("สร้างเสร็จสิ้น");
      router.push(`http://localhost:3000/table`);
    } else if (response.status === 401) {
      setError(true);
      setErrorMessage("มีโต๊ะที่ใช้ชื่อนี้อยู่แล้ว");
    } else {
      toast.error("มีบางอย่างผิดพลาด โปรดลองอีกครั้ง");
    }
  };

  return (
    <div className="p-5 flex flex-col space-y-2">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/table"}>
            <p className="text-2xl font-bold">จัดการโต๊ะ</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="text-2xl font-bold">สร้างโต๊ะใหม่</p>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Input
        variant="bordered"
        type="text"
        label="ชื่อ"
        placeholder="ตั้งชื่อที่ต้องการ"
        isInvalid={error}
        errorMessage={errorMessage}
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          color="primary"
          isLoading={loadingState}
          onPress={async () => {
            setLoadingState(true);
            await serverAction();
            setLoadingState(false);
          }}
        >
          เพิ่ม
        </Button>
      </div>
    </div>
  );
};

export default Page;

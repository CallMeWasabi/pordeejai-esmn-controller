"use client";
import { clientWebserverUrl } from "@/app/constant";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MenuTypeQuery } from "../page";
import Link from "next/link";
import { updateMenuType } from "../serverAction";
import toast from "react-hot-toast";

const Page = () => {
  const searchParams = useSearchParams();
  const [menuTypeId, setMenuTypeId] = useState<number>();
  const [menuTypeName, setMenuTypeName] = useState("");
  const [status, setStatus] = useState("");

  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const loadMenuType = async () => {
      setLoadingState(true);
      const res = await axios.get(
        `${clientWebserverUrl}/api/menu-types/${searchParams.get("id")}`
      );
      if (res.status) {
        setMenuTypeName(res.data.name);
        setStatus(res.data.status);
        setMenuTypeId(res.data.id);
      }
      setLoadingState(false);
    };
    loadMenuType();
  }, [searchParams]);

  return (
    <div className="flex flex-col p-5 gap-4">
      <h3 className="font-bold text-2xl">รายละเอียด</h3>
      <div className="flex flex-col gap-2">
        <p className="font-bold">สถานะ</p>
        <Select
          isLoading={loadingState}
          label={"สถานะ"}
          selectedKeys={[status]}
          onChange={(e) => setStatus(e.target.value)}
        >
          <SelectItem key={"OPEN"}>เปิด</SelectItem>
          <SelectItem key={"CLOSE"}>ปิด</SelectItem>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ชื่อประเภทเมนู</p>
        <Input
          isDisabled={loadingState}
          value={menuTypeName}
          onChange={(e) => setMenuTypeName(e.target.value)}
          variant="faded"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href={{
            pathname: "/menu/property-menutype",
            query: { id: menuTypeId },
          }}
          className="w-full"
        >
          <Button
            className="w-full"
            color="primary"
            variant="flat"
            isLoading={loadingState}
          >
            <p>กลับ</p>
          </Button>
        </Link>
        <Button
          color="primary"
          onClick={async () => {
            if (!menuTypeId) {
              return;
            }
            setLoadingState(true);
            const res = await updateMenuType(menuTypeId, menuTypeName, status);
            if (res === 200) {
              toast.success("แก้ไขสำเร็จ");
            } else {
              toast.error(`แก้ไขล้มเหลว รหัส ${res}`);
            }
            setLoadingState(false);
          }}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default Page;

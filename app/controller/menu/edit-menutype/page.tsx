"use client";
import { clientWebserverUrl } from "@/app/constant";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MenuTypeQuery } from "../page";
import Link from "next/link";
import { updateMenuType } from "../serverAction";
import toast from "react-hot-toast";
import { getToken } from "../../home/serverAction";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [menuTypeId, setMenuTypeId] = useState<number>();
  const [menuTypeName, setMenuTypeName] = useState("");
  const [status, setStatus] = useState("");

  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const loadMenuType = async () => {
      setLoadingState(true);
      try {
        const jwtToken = await getToken();
        const res = await axios.get(
          `${clientWebserverUrl}/api/menu-types/${searchParams.get("id")}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setMenuTypeName(res.data.name);
        setStatus(res.data.status);
        setMenuTypeId(res.data.id);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยนผู้ใช้งานผิดพลาด");
          return router.push("/login");
        }
        console.error(e.message);
      }
      setLoadingState(false);
    };
    loadMenuType();
  }, [searchParams, router]);

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
            pathname: "/controller/menu/property-menutype",
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

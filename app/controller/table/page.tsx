"use client";
import React, { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import axios from "axios";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import MenuButton from "./MenuButton";
import CardTable from "./CardTable";
import { getToken } from "../home/serverAction";
import { useRouter } from "next/navigation";
import { clientWebserverUrl } from "@/app/constant";
import { ExecException } from "child_process";

export type TableQuery = {
  id: number;
  name: string;
  status: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
};

const Page = () => {
  const router = useRouter();
  const [rows, setRows] = useState<TableQuery[]>([]);
  const [currentState, callReload] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      setLoadingState(true);
      try {
        const jwtToken = await getToken();

        const res = await axios.get(`${clientWebserverUrl}/api/tables`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.status != 200) {
          throw new Error(res.status.toString());
        }
        setRows(res.data);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาด");
          return router.push("/login");
        }
        console.error(e.message)
      }
      setLoadingState(false);
    };
    loadInfo();
  }, [currentState, router]);

  const reloadTable = () => {
    callReload(!currentState);
    toast.success("โหลดข้อมูลใหม่ เสร็จสิ้น");
  };

  return (
    <div className="p-5 flex flex-col space-y-3 w-[80vw]">
      <h3 className="font-bold mb-5 text-2xl">จัดการโต๊ะ</h3>
      <StatusCard rows={rows} />
      <div className="w-full flex justify-end font-bold text-lg space-x-2">
        <Button
          color="primary"
          variant="flat"
          onClick={reloadTable}
          isLoading={loadingState}
        >
          โหลดข้อมูลใหม่
        </Button>
        <MenuButton />
      </div>
      <div className="grid grid-cols-6 md:grid-cols-4 gap-3 w-full">
        {rows.map((row, key) => (
          <CardTable row={row} key={key} />
        ))}
      </div>
    </div>
  );
};

export default Page;

"use client";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import axios from "axios";
import { getToken, startTableService } from "./serverAction";
import toast from "react-hot-toast";
import { clientWebserverUrl } from "@/app/constant";
import { useRouter } from "next/navigation";

type Table = {
  id: number;
  name: string;
  uuid: string;
  status: "OPEN" | "CLOSE" | "ERROR" | "IN_SERVICE";
  createdAt: Date;
  updatedAt: Date;
};

const HomePage = () => {
  const router = useRouter()

  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState(-1);
  const [loadingState, setLoadingState] = useState(false);
  const [forceLoading, callForceLoading] = useState(false);

  useEffect(() => {
    const loadTable = async () => {
      try {
        const jwtToken = await getToken();
  
        const res = await axios.get(`${clientWebserverUrl}/api/tables`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const tables = res.data.filter((table: Table) => {
          if (table.status === "OPEN") {
            return true;
          }
          return false;
        });
        setTables(tables);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาด")
          router.push("/login")
        }
        console.error(e.message)
      }
    };
    loadTable();
  }, [forceLoading, router]);

  const onSelectTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTableId(parseInt(e.target.value));
  };

  const serverAction = async () => {
    const res = await startTableService(tableId);
    if (!res) {
      toast.error("ล้มเหลว");
    }
    if (res?.status !== 200) {
      toast.error("ล้มเหลว");
    }
    toast.success("สำเร็จ");
  };

  return (
    <div className="flex flex-col space-y-3 p-5">
      <h3>Home</h3>
      <Select
        label="Select Table"
        placeholder="เลือกโต๊ะที่ต้องทำการเริ่มต้น"
        onChange={onSelectTableChange}
      >
        {tables.map((table) => (
          <SelectItem key={table.id} value={table.id}>
            {table.name}
          </SelectItem>
        ))}
      </Select>
      <Button
        color="primary"
        isLoading={loadingState}
        onClick={async () => {
          setLoadingState(true);
          await startTableService(tableId);
          callForceLoading(!forceLoading);
          setLoadingState(false);
        }}
      >
        เริ่มให้บริการ
      </Button>
    </div>
  );
};

export default HomePage;

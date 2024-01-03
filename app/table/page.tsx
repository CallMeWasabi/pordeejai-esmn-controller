"use client";
import React, { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import axios from "axios";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import MenuButton from "./MenuButton";
import CardTable from "./CardTable";

export type TableQuery = {
  id: number;
  name: string;
  status: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
};

const Page = () => {
  const [rows, setRows] = useState<TableQuery[]>([]);
  const [currentState, callReload] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      setLoadingState(true);
      try {
        const response = await axios.get("http://localhost:8080/api/tables");
        if (response.status != 200) {
          throw new Error();
        }
        setRows(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoadingState(false);
    };
    loadInfo();
  }, [currentState]);

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

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
import { startTableService } from "./serverAction";
import toast from "react-hot-toast";

type Table = {
  id: number;
  name: string;
  uuid: string;
  status: "OPEN" | "CLOSE" | "ERROR" | "IN_SERVICE";
  createdAt: Date;
  updatedAt: Date;
};

const HomePage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState(-1);
  const [loadingState, setLoadingState] = useState(false);
  const [forceLoading, callForceLoading] = useState(false);

  useEffect(() => {
    const loadTable = async () => {
      const response = await axios.get("http://localhost:8080/api/tables");
      const tables = response.data.filter((table: Table) => {
        if (table.status === "OPEN") {
          return true;
        }
        return false;
      });
      setTables(tables);
    };
    loadTable();
  }, [forceLoading]);

  const onSelectTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTableId(parseInt(e.target.value));
  };

  const serverAction = async () => {
    const response = await startTableService(tableId);
    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
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

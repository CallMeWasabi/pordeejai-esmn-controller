"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { TableQuery } from "../page";
import { clientWebserverUrl } from "@/app/constant";

const EditButton = ({ table }: { table: TableQuery }) => {
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const onOpenChange = () => setOpen(!open);

  const confirmDeleteTable = async () => {
    setLoadingState(true);
    try {
      const res = await axios.delete(`${clientWebserverUrl}/api/tables/${table.id}`)
      if (res.status === 200) {
        toast.success("ลบโต๊ะสำเร็จ")
        router.push("/table")
      } else {
        toast.error("ลบโต๊ะล้มเหลว")
        throw new Error()
      }
    } catch (error) {
      console.log(error)
    }
    setLoadingState(false);
  };

  return (
    <div className="w-full flex gap-2">
      <Button
        color="primary"
        variant="flat"
        as={Link}
        href="/table"
        className="w-full"
      >
        กลับ
      </Button>
      <Button color="warning" variant="flat" className="w-full">
        แก้ไข
      </Button>
      <Button
        color="danger"
        variant="flat"
        className="w-full"
        onClick={onOpenChange}
        isDisabled={table.status === "IN_SERVICE"}
      >
        ลบ
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>แน่ใจนะว่าต้องการลบ!!!</ModalHeader>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={loadingState}
                >
                  ยกเลิก
                </Button>
                <Button
                  color="primary"
                  isLoading={loadingState}
                  onClick={async () => {
                    await confirmDeleteTable();
                    onClose();
                  }}
                >
                  ยืนยัน
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditButton;

"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteOption } from "./page";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);

  return (
    <div className="w-full">
      <Button
        color="danger"
        variant="flat"
        className="w-full"
        onClick={onOpenChange}
      >
        <p className="">
          <FaRegTrashAlt />
        </p>
        <p>ลบตัวเลือก</p>
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                แน่ใจนะ!!!
              </ModalHeader>
              <ModalBody>แน่ใจนำว่าต้องการลบตัวเลือกนี้</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  ยกเลิก
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    const status = await deleteOption(id);
                    if (status === 200) {
                      toast.success("ลบตัวเลือก สำเร็จ");
                      router.push("/option");
                    } else {
                      toast.error("ลบตัวเลือก ล้มเหลว");
                    }
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

export default DeleteButton;

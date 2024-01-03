"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteMenuType } from "../serverAction";
import toast from "react-hot-toast";

const DeleteButtonMenuType = ({ id }: { id: number }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const onOpenChange = () => setOpen(!open);

  return (
    <div>
      <Button variant="flat" color="danger" onPress={onOpenChange}>
        <FaRegTrashAlt />
        Delete
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>แน่ใจนะ!!!</ModalHeader>
              <ModalBody>แน่ใจนะว่าต้องการลบประเภทเมนูนี้</ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  variant="light"
                  color="danger"
                  isDisabled={loadingState}
                >
                  ยกเลิก
                </Button>
                <Button
                  onPress={async () => {
                    setLoadingState(true);
                    const status = await deleteMenuType(id);
                    setLoadingState(false);
                    onClose();
                    if (status === 200) {
                      toast.success("ลบเมนูสำเร็จ");
                      router.push(`/menu`);
                    } else {
                      toast.error(`ลบเมนูล้มเหลว รหัส ${status}`);
                    }
                  }}
                  color="primary"
                  isLoading={loadingState}
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

export default DeleteButtonMenuType;

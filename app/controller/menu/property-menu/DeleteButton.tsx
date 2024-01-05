"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteMenu } from "../serverAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DeleteButton = ({
  id,
  menuTypeId,
}: {
  id: number;
  menuTypeId: number;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const onOpenChange = () => setOpen(!open);

  return (
    <div className="w-full">
      <Button
        className="w-full"
        color="danger"
        variant="flat"
        onPress={onOpenChange}
      >
        <FaRegTrashAlt /> ลบเมนู
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>แน่ใจนะ!!!</ModalHeader>
              <ModalBody>แน่ใจนะว่าต้องการลบเมนูนี้</ModalBody>
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
                    const status = await deleteMenu(id);
                    setLoadingState(false);
                    onClose();
                    if (status === 200) {
                      toast.success("ลบเมนูสำเร็จ");
                      router.push(`/menu/${menuTypeId}`);
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

export default DeleteButton;

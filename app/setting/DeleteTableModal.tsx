"use client";
import React, { useEffect, useState } from "react";
import { TableQuery } from "../table/page";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";

const DeleteTableModal = () => {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(-1);
  const [loadingStateModalDelete, setLoadingStateModalDelete] = useState(false);
  const [possibleTable, setPossibleTable] = useState<TableQuery[]>([]);

  const [openSubModal, setOpenSubModal] = useState(false);

  const onModalDeleteChange = () => {
    setSelectedTableId(-1);
    setLoadingStateModalDelete(false);
    setOpenModalDelete(!openModalDelete);
  };

  const onSubModalChange = () => {
    setOpenSubModal(!openSubModal);
  };

  const onSelectedTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    for (let i = 0; i < possibleTable.length; i++) {
      if (e.target.value === possibleTable[i].name) {
        setSelectedTableId(possibleTable[i].id);
        break;
      }
    }
  };

  const deleteTable = async () => {
    setLoadingStateModalDelete(true);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/tables/${selectedTableId}`
      );
      if (response.status === 200) {
        onSubModalChange();
        onModalDeleteChange();
        toast.success("ลบข้อมูล เสร็จสิ้น");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      onSubModalChange();
      onModalDeleteChange();
      toast.error("มีบางอย่างผิดปกติ โปรดลองอีกครั้ง");
    }
  };

  // Loading table is possible change
  useEffect(() => {
    const loadingItem = async () => {
      const response = await axios.get("http://localhost:8080/api/tables");
      const filteredItems = response.data.filter((item: TableQuery) => {
        if (item.status !== "IN_SERVICE" && item.status !== "ERROR") {
          return true;
        }
        return false;
      });
      setPossibleTable(filteredItems);
    };
    if (openModalDelete) {
      loadingItem();
    }
  }, [openModalDelete]);
  return (
    <div>
      <Button color="danger" onClick={onModalDeleteChange}>
        ลบ
      </Button>
      <Modal
        isOpen={openModalDelete}
        onOpenChange={onModalDeleteChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ลบโต๊ะ <br /> (ลบได้เฉพาะโต๊ะที่สถานะ OPEN หรือ CLOSE เท่านั้น)
              </ModalHeader>
              <ModalBody>
                <Select
                  label="เลือกโต๊ะที่ต้องการลบ"
                  onChange={onSelectedTableChange}
                >
                  {possibleTable.map((item: any) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loadingStateModalDelete}
                >
                  ยกเลิก
                </Button>
                <Button
                  color="danger"
                  isDisabled={selectedTableId < 0 ? true : false}
                  onPress={async () => {
                    onSubModalChange();
                  }}
                >
                  ลบ
                </Button>
                <Modal
                  backdrop="blur"
                  isOpen={openSubModal}
                  onOpenChange={() => setOpenSubModal(!openSubModal)}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="text-red-600">
                          แน่ใจนะ ว่าต้องการลบ!!!
                        </ModalHeader>
                        <ModalFooter>
                          <Button onPress={onClose} color="primary">
                            ไม่
                          </Button>
                          <Button
                            onPress={onClose}
                            color="danger"
                            onClick={async () => {
                              await deleteTable();
                            }}
                          >
                            ใช่
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteTableModal;

"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddTableModal = () => {
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [tableName, setTableName] = useState("");
  const [errorModalAdd, setErrorModalAdd] = useState(false);
  const [errorMessageModalAdd, setErrorMessageModalAdd] = useState("");
  const [loadingStateModalAdd, setLoadingStateModalAdd] = useState(false);

  const onModalAddChange = () => {
    setErrorModalAdd(false);
    setTableName("");
    setErrorMessageModalAdd("");
    setLoadingStateModalAdd(false);
    setOpenModalAdd(!openModalAdd);
  };

  const onTableNameChange = (e: any) => {
    setTableName(e.target.value);
  };

  const validateTableName = async () => {
    setLoadingStateModalAdd(true);
    const tables = await axios.get("http://localhost:8080/api/tables");
    for (let i = 0; i < tables.data.length; i++) {
      if (tables.data[i].name === tableName) {
        setErrorModalAdd(true);
        setErrorMessageModalAdd("มีชื่อนี้อยู่แล้วโปรดใส่ชื่อที่ไม่ซ้ำ");
        setLoadingStateModalAdd(false);
        return;
      }
    }
    try {
      const response = await axios.post("http://localhost:8080/api/tables", {
        name: tableName,
      });
      if (response.status === 200) {
        onModalAddChange();
        toast.success("เพิ่มโต๊ะใหม่ เสร็จสิ้น");
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error);
      onModalAddChange();
      toast.error("มีบางอย่างผิดปกติ โปรดลองอีกครั้ง");
    }
  };

  return (
    <div>
      <Button onClick={onModalAddChange} color="primary">
        เพิ่ม
      </Button>
      <Modal
        isOpen={openModalAdd}
        onOpenChange={onModalAddChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                เพิ่มโต๊ะ (ห้ามใส่ชื่อซ้ำ)
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="ชื่อ"
                  value={tableName}
                  onChange={onTableNameChange}
                  isInvalid={errorModalAdd}
                  errorMessage={errorMessageModalAdd}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loadingStateModalAdd}
                >
                  ยกเลิก
                </Button>
                <Button
                  color="primary"
                  isLoading={loadingStateModalAdd}
                  onPress={async () => {
                    await validateTableName();
                  }}
                >
                  เพิ่ม
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddTableModal;

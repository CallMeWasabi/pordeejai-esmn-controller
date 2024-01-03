"use client";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
  Card,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { createNewOption } from "./action";
import toast from "react-hot-toast";
import Link from "next/link";

const Page = () => {
  const [optionName, setOptionName] = useState("");
  const [required, setRequired] = useState(false);
  const [multi, setMulti] = useState(false);
  const [maximumSelect, setMaximumSelect] = useState(1);
  const [choices, setChoices] = useState<
    { name: string; price: number; prefix: string }[]
  >([]);

  // Modal state
  const [open, setOpen] = useState(false);
  const onOpenChange = () => {
    setChoiceName("");
    setChoicePrice(0);
    setPrefix("none");
    setOpen(!open);
  };
  const [choiceName, setChoiceName] = useState("");
  const [choicePrice, setChoicePrice] = useState(0);
  const [prefix, setPrefix] = useState("none");
  const onSelectValueChage = (e: boolean, target: string) => {
    if (e) {
      if (target === "none") {
        setChoicePrice(0);
        setPrefix("none");
      } else {
        setPrefix(target);
      }
    } else {
      setChoicePrice(0);
      setPrefix("none");
    }
  };
  const addNewChoice = () => {
    setChoices([...choices, { name: choiceName, price: choicePrice, prefix }]);
  };
  const deleteChoice = (targetName: string) => {
    setChoices([
      ...choices.filter((choice) =>
        choice.name === targetName ? false : true
      ),
    ]);
  };

  const [editState, setEditState] = useState(false);
  const changePositionUp = (key: number) => {
    let newChoices = [];
    for (let i = 0; i < choices.length; i++) {
      if (i + 1 === key) {
        newChoices.push(choices[i + 1]);
        newChoices.push(choices[i]);
        i += 1;
      } else {
        newChoices.push(choices[i]);
      }
    }
    setChoices(newChoices);
  };
  const changePositionDown = (key: number) => {
    let newChoices = [];

    for (let i = 0; i < choices.length; i++) {
      if (i === key) {
        newChoices.push(choices[i + 1]);
        newChoices.push(choices[i]);
        i += 1;
      } else {
        newChoices.push(choices[i]);
      }
    }

    setChoices(newChoices);
  };

  const [loadingState, setLoadingState] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-5">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/option"} className="font-bold text-2xl">ตัวเลือก</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <h3 className="font-bold text-2xl">สร้างตัวเลือกใหม่</h3>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Input
        variant="faded"
        label="ชื่อตัวเลือก"
        value={optionName}
        onChange={(e) => setOptionName(e.target.value)}
        isDisabled={loadingState}
      />
      <Checkbox
        isSelected={required}
        onValueChange={setRequired}
        isDisabled={loadingState}
      >
        ลูกค้าจำเป็นต้องเลือก
      </Checkbox>
      <Checkbox
        isSelected={multi}
        onValueChange={setMulti}
        isDisabled={loadingState}
      >
        <p>ลูกค้าสามารถเลือกได้มากกว่า 1 ช้อยส์</p>
        {multi && (
          <div className="flex gap-3">
            <p>เลือกได้สูงสุด</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                onClick={() =>
                  maximumSelect <= 1
                    ? null
                    : setMaximumSelect(maximumSelect - 1)
                }
              >
                -
              </Button>
              <p>{maximumSelect}</p>
              <Button
                size="sm"
                variant="flat"
                onClick={() => setMaximumSelect(maximumSelect + 1)}
              >
                +
              </Button>
            </div>
          </div>
        )}
      </Checkbox>
      <div className="flex justify-between">
        <h3 className="font-bold">ช้อยส์</h3>
        <Button
          size="sm"
          color="primary"
          variant={editState ? "solid" : "light"}
          onClick={() => setEditState(!editState)}
          isDisabled={loadingState}
        >
          แก้ไขลำดับ
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {choices.map((choice, key) => (
            <Card key={key}>
              <CardHeader className="flex flex-row justify-between">
                <p>{choice.name}</p>
                <div className="flex flex-row items-center gap-1">
                  <p>
                    {choice.prefix === "inc"
                      ? "+"
                      : choice.prefix === "desc"
                      ? "-"
                      : ""}{" "}
                    ฿ {choice.price.toFixed(2)}
                  </p>
                  {!editState ? (
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => deleteChoice(choice.name)}
                    >
                      <RxCross1 />
                    </Button>
                  ) : (
                    <div className="flex flex-row gap-1">
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={key === 0}
                        onClick={() => changePositionUp(key)}
                      >
                        <FaArrowUp />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={key === choices.length - 1}
                        onClick={() => changePositionDown(key)}
                      >
                        <FaArrowDown />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Button
          color="primary"
          variant="flat"
          onClick={onOpenChange}
          isDisabled={loadingState}
        >
          + เพิ่มช้อยส์
        </Button>
        <Modal isOpen={open} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  สร้างช้อยส์
                </ModalHeader>
                <ModalBody>
                  <Input
                    variant="faded"
                    label="ชื่อช้อยส์"
                    type="text"
                    value={choiceName}
                    onChange={(e) => setChoiceName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Checkbox
                      isSelected={prefix === "inc" ? true : false}
                      onValueChange={(e) => onSelectValueChage(e, "inc")}
                    >
                      เพิ่มราคา
                    </Checkbox>
                    <Checkbox
                      isSelected={prefix === "desc" ? true : false}
                      onValueChange={(e) => onSelectValueChage(e, "desc")}
                    >
                      ลดราคา
                    </Checkbox>
                    <Checkbox
                      isSelected={prefix === "none" ? true : false}
                      onValueChange={(e) => onSelectValueChage(e, "none")}
                    >
                      ไม่มี
                    </Checkbox>
                  </div>
                  {prefix !== "none" && (
                    <Input
                      variant="faded"
                      label="ราคา"
                      type="number"
                      value={choicePrice.toString()}
                      onChange={(e) => setChoicePrice(parseInt(e.target.value))}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="font-bold">฿</span>
                        </div>
                      }
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="flat" onPress={onClose}>
                    กลับ
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      addNewChoice();
                      onClose();
                    }}
                  >
                    บันทึก
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <Button
        color="primary"
        isLoading={loadingState}
        onClick={async () => {
          setLoadingState(true);
          const response = await createNewOption(
            optionName,
            JSON.stringify(choices),
            required,
            multi,
            maximumSelect
          );
          if (response.status === 200) {
            setOptionName("");
            setRequired(false);
            setMulti(false);
            setChoices([]);
            toast.success("สร้างสำเร็จ");
          } else {
            toast.error(`ล้มเหลว รหัส ${response.status} โปรดลองใหม่อีกครั้ง`);
          }
          setLoadingState(false);
        }}
      >
        บันทึก
      </Button>
    </div>
  );
};
export default Page;

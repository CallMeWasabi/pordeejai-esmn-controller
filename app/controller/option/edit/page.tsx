"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { updateOption } from "./action";
import { clientWebserverUrl } from "@/app/constant";
import { getToken } from "../../home/serverAction";
import { OptionQuery } from "../../menu/page";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const [loadingState, setLoadingState] = useState(true);
  const [forceLoading, callForceLoading] = useState(false);

  useEffect(() => {
    const loadOption = async () => {
      setLoadingState(true);
      try {
        const jwtToken = await getToken();
        const res = await axios.get(
          `${clientWebserverUrl}/api/options/${searchParams.get("id")}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (res.status === 200) {
          setLoadingState(false);
          const option: OptionQuery = res.data;
          setOptionName(option.name);
          setRequired(option.required);
          setMulti(option.multi_select);
          setMaximumSelect(option.max_multi);
          setChoices(JSON.parse(option.choices));
        }
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันตัวตนผิดพลาด");
          return router.push("/login");
        }
        console.log(e);
      }
      setLoadingState(false);
    };
    loadOption();
  }, [searchParams, forceLoading, router]);

  return (
    <div className="flex flex-col gap-4 p-5">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/controller/option"} className="font-bold text-2xl">
            ตัวเลือก
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            href={`/controller/option/${searchParams.get("id")}`}
            className="font-bold text-2xl"
          >
            รายละเอียด
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <h3 className="font-bold text-2xl">แก้ไขตัวเลือก</h3>
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          variant="light"
          onClick={() => callForceLoading(!forceLoading)}
          isLoading={loadingState}
        >
          โหลดข้อมูลใหม่
        </Button>
      </div>
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
          const id = searchParams.get("id");
          if (!id) {
            return;
          }
          const res = await updateOption(
            id,
            optionName,
            JSON.stringify(choices),
            required,
            multi,
            maximumSelect
          );
          if (!res) {
            toast.error(`ล้มเหลว โปรดลองใหม่อีกครั้ง`);
          }
          else if (res.status !== 200) {
            toast.error(`ล้มเหลว รหัส ${res?.status} โปรดลองใหม่อีกครั้ง`);
          }
          toast.success("แก้ไขสำเร็จ");
          setLoadingState(false);
        }}
      >
        บันทึกการแก้ไข
      </Button>
    </div>
  );
};

export default Page;

"use server";
import { Button, Card, CardHeader, Checkbox, Chip } from "@nextui-org/react";
import React from "react";
import { MenuQuery, OptionQuery, convertThaiDate } from "../page";
import axios from "axios";
import { statusSelected } from "../[menuTypeId]/CardMenu";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import DeleteButton from "./DeleteButton";
import ClientRenderDate from "./ClientRenderDate";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const id = searchParams["id"];
  const res = await axios.get(`${process.env.WEBSERVER_URL}/api/menus/${id}`);
  const menu: MenuQuery = res.data;

  const readChoices = (option: OptionQuery) => {
    let temp = "";
    const choices = JSON.parse(option.choices);
    for (let i = 0; i < choices.length; i++) {
      if (i + 1 != choices.length) {
        temp += choices[i].name + ", ";
      } else {
        temp += choices[i].name;
      }
    }
    return temp;
  };

  return (
    <div className="flex flex-col p-5 gap-4">
      <h3 className="font-bold text-2xl">รายละเอียด</h3>
      <div className="flex flex-col gap-2">
        <p className="font-bold">สถานะ</p>
        <Chip variant="flat" color={statusSelected(menu?.status, "color")}>
          {statusSelected(menu?.status, "label")}
        </Chip>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="font-bold">ชื่อเมนู</p>
        </div>
        <p>{menu?.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ราคาเริ่มต้น</p>
        <p>{menu?.price} บาท</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ตัวเลือก</p>
        {menu.options.length > 0 ? (
          <>
            {menu?.options.map((option, key) => (
              <Card key={key}>
                <CardHeader className="flex gap-2">
                  <Checkbox isSelected={true} isReadOnly={true}></Checkbox>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">{option.name}</p>
                    <p className="opacity-70">{readChoices(option)}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </>
        ) : (
          <>
            <p>ไม่มีตัวเลือกในเมนูนี้</p>
          </>
        )}
      </div>
      <ClientRenderDate
        created_at={menu.created_at}
        updated_at={menu.updated_at}
      />
      <div className="flex gap-2">
        <Button
          as={Link}
          href={`/menu/${menu.menu_type_id ?? "0"}`}
          color="primary"
          variant="flat"
        >
          กลับ
        </Button>
        <Link
          href={{ pathname: "/menu/edit-menu", query: { id: menu?.id } }}
          className="w-full"
        >
          <Button className="w-full" color="warning" variant="flat">
            <p>
              <CiEdit />
            </p>
            <p>แก้ไข</p>
          </Button>
        </Link>
        <DeleteButton id={menu.id} menuTypeId={menu.menu_type_id} />
      </div>
    </div>
  );
};

export default Page;

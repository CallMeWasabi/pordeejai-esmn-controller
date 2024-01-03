"use server";
import { Button, Chip } from "@nextui-org/react";
import React from "react";
import { MenuTypeQuery } from "../page";
import axios from "axios";
import { statusSelected } from "../[menuTypeId]/CardMenu";
import ClientRenderDate from "../property-menu/ClientRenderDate";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import DeleteButtonMenuType from "./DeleteButtonMenuType";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const id = searchParams["id"];
  const res = await axios.get(
    `${process.env.WEBSERVER_URL}/api/menu-types/${id}`
  );
  const menuType: MenuTypeQuery = res.data;

  return (
    <div className="flex flex-col p-5 gap-4">
      <h3 className="font-bold text-2xl">รายละเอียด</h3>
      <div className="flex flex-col gap-2">
        <p className="font-bold">สถานะ</p>
        <Chip variant="flat" color={statusSelected(menuType?.status, "color")}>
          {statusSelected(menuType?.status, "label")}
        </Chip>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ชื่อประเภทเมนู</p>
        <p>{menuType?.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">จำนวนเมนู</p>
        <p>{menuType.menus.length}</p>
      </div>
      <ClientRenderDate
        created_at={menuType?.created_at}
        updated_at={menuType?.updated_at}
      />
      <div className="flex gap-2">
        <Button
          as={Link}
          href={`/menu`}
          color="primary"
          variant="flat"
        >
          กลับ
        </Button>
        <Link
          href={{
            pathname: "/menu/edit-menutype",
            query: { id: menuType?.id },
          }}
          className="w-full"
        >
          <Button className="w-full" color="warning" variant="flat">
            <p>
              <CiEdit />
            </p>
            <p>แก้ไข</p>
          </Button>
        </Link>
        <DeleteButtonMenuType id={menuType.id} />
      </div>
    </div>
  );
};

export default Page;

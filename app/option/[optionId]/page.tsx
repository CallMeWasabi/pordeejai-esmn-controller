"use server";
import { OptionQuery } from "@/app/menu/page";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import React from "react";
import ClientRenderDate from "./ClientRenderDate";
import DeleteButton from "./DeleteButton";
import { CiEdit } from "react-icons/ci";

export const deleteOption = async (id: number) => {
  const response = await axios.delete(
    `${process.env.WEBSERVER_URL}/api/options/${id}`
  );
  if (response.status === 200) {
    return 200;
  } else {
    return response.status;
  }
};

const Page = async ({ params }: { params: { optionId: number } }) => {
  const response = await axios.get(
    `${process.env.WEBSERVER_URL}/api/options/${params.optionId}`
  );
  const option: OptionQuery = response.data;
  const choices = JSON.parse(option.choices);

  return (
    <div className="flex flex-col p-5 gap-4">
      <h3 className="font-bold text-2xl">รายละเอียด</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">ชื่อตัวเลือก</h3>
          <Button color="primary" variant="flat" as={Link} href="/option">
            กลับ
          </Button>
        </div>
        <p>{option.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">ช้อยส์</p>
        <div className="flex flex-col gap-2">
          {choices.map(
            (
              choice: { name: string; price: number; prefix: string },
              key: number
            ) => (
              <Card key={key}>
                <CardHeader className="flex justify-between">
                  <h3>{choice.name}</h3>
                  <div className="flex gap-2 items-center">
                    <p>
                      {choice.prefix === "inc"
                        ? "+"
                        : choice.prefix === "desc"
                        ? "-"
                        : ""}
                    </p>
                    <p>฿</p>
                    <p>{choice.price.toFixed(2)}</p>
                  </div>
                </CardHeader>
              </Card>
            )
          )}
        </div>
      </div>
      <ClientRenderDate
        created_at={option.created_at}
        updated_at={option.updated_at}
      />
      <div className="flex gap-2">
        <Link
          href={{ pathname: "/option/edit", query: { id: option.id } }}
          className="w-full"
        >
          <Button className="w-full" color="warning" variant="flat">
            <p>
              <CiEdit />
            </p>
            <p>แก้ไข</p>
          </Button>
        </Link>
        <DeleteButton id={params.optionId} />
      </div>
    </div>
  );
};

export default Page;

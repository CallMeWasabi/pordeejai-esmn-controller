"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
} from "@nextui-org/react";
import { TableQuery } from "./page";
import Link from "next/link";

const CardTable = ({ row }: { row: TableQuery }) => {
  const statusSelected = (status: string) => {
    if (status === "OPEN") {
      return (
        <Chip color="success" variant="flat">
          ว่าง
        </Chip>
      );
    } else if (status === "IN_SERVICE") {
      return (
        <Chip color="warning" variant="flat">
          กำลังให้บริการ
        </Chip>
      );
    } else if (status === "CLOSE") {
      return (
        <Chip color="danger" variant="flat">
          ปิดการใช้งาน
        </Chip>
      );
    } else {
      return (
        <Chip color="danger" variant="flat">
          เกิดข้อผิดพลาด
        </Chip>
      );
    }
  };

  return (
    <Card className="px-2">
      <CardHeader>
        <div className="flex justify-between w-full">
          <p className="font-bold text-lg">{row.name}</p>
          {statusSelected(row.status)}
        </div>
      </CardHeader>
      <CardBody></CardBody>
      <CardFooter>
        <div className="flex flex-col items-end w-full space-y-2">
            <Button
              as={Link}
              href={`/table/order?id=${row.id}`}
              className="w-full"
              color="primary"
              isDisabled={row.status === "IN_SERVICE" ? false : true}
            >
              ดูรายการสั่งซื้อ
            </Button>
          <Link
            href={{ pathname: "/table/property", query: { id: row.id } }}
            className="w-full"
          >
            <Button className="w-full" color="primary" variant="flat">
              คุณสมบัติ
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardTable;

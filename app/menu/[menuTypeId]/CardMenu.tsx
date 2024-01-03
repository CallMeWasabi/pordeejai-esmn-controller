import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
} from "@nextui-org/react";
import { MenuQuery } from "../page";
import Link from "next/link";

export const statusSelected: any = (status: string, selected: string) => {
  if (selected === "color") {
    if (status === "OPEN") {
      return "success";
    } else if (status === "IN_SERVICE") {
      return "warning";
    } else {
      return "danger";
    }
  } else if (selected === "label") {
    if (status === "OPEN") {
      return "เปิด";
    } else if (status === "CLOSE") {
      return "ปิด";
    } else {
      return "เกิดข้อผิดพลาด";
    }
  }
};

const CardMenu = ({ row }: { row: MenuQuery }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between w-full">
          <p className="font-bold text-lg">{row.name}</p>
          <Chip variant="flat" color={statusSelected(row.status, "color")}>
            {statusSelected(row.status, "label")}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <p className="font-bold">{row.price} บาท</p>
      </CardBody>
      <CardFooter>
        <div className="flex flex-col w-full space-y-2">
          <Button
            as={Link}
            href={`/menu/property-menu?id=${row.id}`}
            className="w-full"
            color="primary"
          >
            รายละเอียด
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardMenu;

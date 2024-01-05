"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import AddTableModal from "../setting/AddTableModal";
import Link from "next/link";

const MenuButton = () => {
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" color="default">
            เพิ่มเติม
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new" as={Link} href="/controller/table/new">สร้าง</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default MenuButton;

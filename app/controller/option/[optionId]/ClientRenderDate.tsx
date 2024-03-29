"use client";
import React from "react";

const convertThaiDate = (date: Date) => {
  const result = new Date(date);
  return result.toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "medium",
  });
};

const ClientRenderDate = ({
  created_at,
  updated_at,
}: {
  created_at: Date;
  updated_at: Date;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">สร้างขึ้นเมื่อ</h3>
        <p>{convertThaiDate(created_at)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">แก้ไขล่าสุดเมื่อ</h3>
        <p>{convertThaiDate(updated_at)}</p>
      </div>
    </div>
  );
};

export default ClientRenderDate;

"use client";
import React from "react";
import { MenuQuery, convertThaiDate } from "../page";

const ClientRenderDate = ({
  created_at,
  updated_at,
}: {
  created_at: Date | undefined;
  updated_at: Date | undefined;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <p className="font-bold">สร้างขึ้นเมื่อ</p>
        {created_at && 
          <p>{convertThaiDate(created_at)}</p>
        }
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold">แก้ไขล่าสุดเมื่อ</p>
        {updated_at &&
          <p>{convertThaiDate(updated_at)}</p>
        }
      </div>
    </div>
  );
};

export default ClientRenderDate;

"use client";
import { Button, Card, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { OptionQuery } from "../menu/page";
import { clientWebserverUrl } from "@/app/constant";
import { getToken } from "../home/serverAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter()
  const [options, setOptions] = useState<OptionQuery[]>([]);

  const readChoice = (str: string) => {
    let props = "";
    const choices = JSON.parse(str);
    for (let i = 0; i < choices.length; i++) {
      props += choices[i].name + ", ";
    }

    return props;
  };

  useEffect(() => {
    const loadOption = async () => {
      try {
        const jwtToken = await getToken()
        const res = await axios.get(`${clientWebserverUrl}/api/options`, {
          headers: {
            "Authorization": `Bearer ${jwtToken}`
          }
        });
        if (res.status === 401) {
          return router.push("/login")
        }
        if (res.status !== 200) {
          throw new Error(res.statusText)
        }
        setOptions(res.data);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาด")
          return router.push("/login")
        }
        console.log(e)
      }
    };
    loadOption();
  }, [setOptions, router]);

  return (
    <div className="flex flex-col p-5 gap-2">
      <h3 className="font-bold text-2xl mb-5">ตัวเลือก</h3>
      <div className="grid grid-cols-4 gap-3">
        {options.map((option) => (
          <Link
            href={`/controller/option/${option.id}`}
            key={option.id}
          >
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <h3 className="font-bold">{option.name}</h3>
                <p className="opacity-70">{readChoice(option.choices)}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <Button color="primary" as={Link} href="/controller/option/new" variant="flat" className="mt-5">
        + สร้างตัวเลือกใหม่
      </Button>
    </div>
  );
};

export default Page;

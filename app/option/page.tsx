"use client";
import { Button, Card, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { OptionQuery } from "../menu/page";

const Page = () => {
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
      const response = await axios.get("http://localhost:8080/api/options");
      if (response.status === 200) {
        setOptions(response.data);
      }
    };
    loadOption();
  }, [setOptions]);

  return (
    <div className="flex flex-col p-5 gap-2">
      <h3 className="font-bold text-2xl mb-5">ตัวเลือก</h3>
      <div className="grid grid-cols-4 gap-3">
        {options.map((option) => (
          <Link
            href={`/option/${option.id}`}
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
      <Button color="primary" as={Link} href="/option/new" variant="flat" className="mt-5">
        + สร้างตัวเลือกใหม่
      </Button>
    </div>
  );
};

export default Page;

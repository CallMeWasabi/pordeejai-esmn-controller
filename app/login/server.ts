"use server"

import { cookies } from "next/headers"


export const setTokenCookie = (token: string) => {
    cookies().set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/"
    })
}
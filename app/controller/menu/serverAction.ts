"use server"
import axios from "axios"
import { OptionQuery } from "./page"
import { getToken } from "../home/serverAction"
import { redirect } from "next/navigation"


export const updateMenu = async (id: number, name: string, price: number, status: string, options: OptionQuery[]) => {
    try {

        const jwtToken = await getToken()
        const res = await axios.put(`${process.env.WEBSERVER_URL}/api/menus/${id}`, {
            name,
            price,
            status,
            options,
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        return res.status
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
        console.error(e.message)
    }
}

export const createMenu = async (name: string, price: number, options: OptionQuery[], menu_type_id: number) => {
    try {
        const jwtToken = await getToken()
        const res = await axios.post(`${process.env.WEBSERVER_URL}/api/menus`, {
            name,
            price,
            options,
            menu_type_id
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        return res.status
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
        console.error(e)
    }
}

export const deleteMenu = async (id: number) => {
    try {
        const jwtToken = await getToken()
        const res = await axios.delete(`${process.env.WEBSERVER_URL}/api/menus/${id}`, {
            headers: {
                "Authorization": ` Bearer ${jwtToken}`
            }
        })
        if (res.status === 401) {
            return redirect("/login")
        }
        return res.status
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
        console.error(e.message)
    }
}


export const deleteMenuType = async (id: number) => {
    try {

        const jwtToken = await getToken()
        const res = await axios.delete(`${process.env.WEBSERVER_URL}/api/menu-types/${id}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        if (res.status == 401) {
            return redirect("/login")
        }
        return res.status
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
        console.error(e.message)
    }
}

export const updateMenuType = async (id: number, name: string, status: string) => {
    try {
        const jwtToken = await getToken()
        const res = await axios.put(`${process.env.WEBSERVER_URL}/api/menu-types/${id}`, {
            name,
            status
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        if (res.status === 401) {
            return redirect("/login")
        }
        return res.status

    } catch (error) {
        console.log(error)
    }
}
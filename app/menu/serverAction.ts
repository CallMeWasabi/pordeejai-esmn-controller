"use server"
import axios from "axios"
import { OptionQuery } from "./page"

export const updateMenu = async (id: number, name: string, price: number, status: string, options: OptionQuery[]) => {
    const res = await axios.put(`${process.env.WEBSERVER_URL}/api/menus/${id}`, {
        name,
        price,
        status,
        options,
    })
    return res.status
}

export const createMenu = async (name: string, price: number, options: OptionQuery[], menu_type_id: number) => {
    const res = await axios.post(`${process.env.WEBSERVER_URL}/api/menus`, {
        name,
        price,
        options,
        menu_type_id
    })
    return res.status
}

export const deleteMenu = async (id: number) => {
    const res = await axios.delete(`${process.env.WEBSERVER_URL}/api/menus/${id}`)
    return res.status
}


export const deleteMenuType = async (id: number) => {
    const res = await axios.delete(`${process.env.WEBSERVER_URL}/api/menu-types/${id}`)
    return res.status
}

export const updateMenuType = async (id: number, name: string, status: string) => {
    const res = await axios.put(`${process.env.WEBSERVER_URL}/api/menu-types/${id}`, {
        name,
        status
    })
    return res.status
}
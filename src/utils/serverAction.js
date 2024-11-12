"use server"

import { SearchFunction } from "@/js/recupSearch"

export default async function startSearch(values) {
    return await SearchFunction(values)
}
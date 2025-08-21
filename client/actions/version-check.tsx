import { VERSION } from "@/version";

export async function readVersionServer(){
    "use server";
    return VERSION;
}

export function readVersionClient(){
    "use client";
    return VERSION;     
}
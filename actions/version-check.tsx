import fs from "fs";

export async function readVersionServer(){
    "use server";

    try {
        const data = await fs.promises.readFile("version.txt", "utf8");
        return data.trim();
    } catch (err: any) {
        return "Error reading version file: " + err.message;
    }
}

export function readVersionClient(){
    "use client";
    // TODO: work out if theres a better way to get static assets without require, or if this analyzer should be disabled
     
    // return require("../assets/version.txt").default.trim();
    return "todo";
}
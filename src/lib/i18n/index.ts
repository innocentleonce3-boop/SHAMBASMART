import { cookies } from "next/headers";
import en from "@/messages/en";
import sw from "@/messages/sw";

export type Locale = "en" | "sw";
export type Messages = typeof en;

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("shamba-locale")?.value === "sw" ? "sw" : "en";
}

export async function getMessages(): Promise<Messages> {
  return (await getLocale()) === "sw" ? sw : en;
}
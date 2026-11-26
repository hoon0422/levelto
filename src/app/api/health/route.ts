import { NextResponse } from "next/server";
import { getServiceConfigFlags } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "levelto",
    services: getServiceConfigFlags(),
  });
}

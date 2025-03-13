import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.selectFrom("titles").selectAll().limit(5).execute();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}

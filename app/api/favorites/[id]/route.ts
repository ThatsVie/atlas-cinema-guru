import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/favorites/:id
 */
export async function POST(req: NextRequest, { params }: { params?: { id?: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
  }
  
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  try {
    const exists = await favoriteExists(params.id, email);
    if (exists) {
      return NextResponse.json({ message: "Already favorited" }, { status: 409 });
    }

    await insertFavorite(params.id, email);
    return NextResponse.json({ message: "Favorite added successfully" }, { status: 201 });

  } catch (error) {
    console.error("Database Error - Failed to add favorite:", error);
    return NextResponse.json({ error: "Database error - Unable to add favorite" }, { status: 500 });
  }
}

/**
 * DELETE /api/favorites/:id
 */
export async function DELETE(req: NextRequest, { params }: { params?: { id?: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
  }

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  try {
    await deleteFavorite(params.id, email);
    return NextResponse.json({ message: "Favorite removed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Database Error - Failed to remove favorite:", error);
    return NextResponse.json({ error: "Database error - Unable to remove favorite" }, { status: 500 });
  }
}

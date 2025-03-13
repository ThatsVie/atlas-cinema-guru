import { deleteWatchLater, watchLaterExists, insertWatchLater } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/watch-later/:id
 */
export async function POST(req: NextRequest, { params }: { params?: { id?: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  const movieId = params.id;
  const email = session.user.email;

  try {
    const exists = await watchLaterExists(movieId, email);
    if (exists) {
      return NextResponse.json({ message: "Already in Watch Later" }, { status: 409 });
    }

    await insertWatchLater(movieId, email);
    return NextResponse.json({ message: "Added to Watch Later" }, { status: 201 });

  } catch (error) {
    console.error("Database Error - Failed to add watch-later:", error);
    return NextResponse.json({ error: "Failed to add watch-later" }, { status: 500 });
  }
}

/**
 * DELETE /api/watch-later/:id
 */
export async function DELETE(req: NextRequest, { params }: { params?: { id?: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }

  const movieId = params.id;
  const email = session.user.email;

  try {
    await deleteWatchLater(movieId, email);
    return NextResponse.json({ message: "Removed from Watch Later" }, { status: 200 });

  } catch (error) {
    console.error("Database Error - Failed to remove watch-later:", error);
    return NextResponse.json({ error: "Failed to remove watch-later" }, { status: 500 });
  }
}

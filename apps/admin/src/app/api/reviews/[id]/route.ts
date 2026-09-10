import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getCurrentAdmin } from "@/lib/auth";

function isValidStatus(value: unknown): value is "CONFIRMED" | "REJECTED" {
  return value === "CONFIRMED" || value === "REJECTED";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // requireAdmin() redirects, which isn't the right shape for a JSON API
  // route — a plain 401 is.
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { status } = (body ?? {}) as Record<string, unknown>;
  if (!isValidStatus(status)) {
    return NextResponse.json(
      { error: "status must be CONFIRMED or REJECTED" },
      { status: 400 },
    );
  }

  const review = await withDbRetry(() =>
    prisma.review.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    }),
  );

  return NextResponse.json(review);
}

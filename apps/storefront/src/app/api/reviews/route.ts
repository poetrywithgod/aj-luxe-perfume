import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";

export async function POST(request: Request) {
  const customerId = await getSessionCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Please log in to leave a review" }, {
      status: 401,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { productId, rating, comment } = (body ?? {}) as Record<string, unknown>;

  if (typeof productId !== "string" || !productId) {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  if (typeof comment !== "string" || comment.trim().length < 5) {
    return NextResponse.json(
      { error: "Please write a few words about your experience" },
      { status: 400 },
    );
  }

  const product = await withDbRetry(() =>
    prisma.product.findUnique({ where: { id: productId }, select: { id: true } }),
  );
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const review = await withDbRetry(() =>
      prisma.review.create({
        data: {
          productId,
          customerId,
          rating,
          comment: comment.trim(),
          // status defaults to PENDING — an admin has to approve it (see
          // apps/admin/.../reviews) before it shows on the product page.
        },
        select: { id: true, status: true },
      }),
    );
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    // Unique constraint on [productId, customerId] — they already have a
    // review (pending, approved, or rejected) for this product.
    if ((error as { code?: string } | undefined)?.code === "P2002") {
      return NextResponse.json(
        { error: "You've already reviewed this product" },
        { status: 409 },
      );
    }
    throw error;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createFaqItem,
  deleteFaqItem,
  getFaqItems,
  updateFaqItem,
} from "@/lib/db/faq";

export async function GET() {
  try {
    const items = await getFaqItems(true);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "שגיאת שרת" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { question, answer } = (await request.json()) as {
      question?: string;
      answer?: string;
    };

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: "נא למלא שאלה ותשובה" }, { status: 400 });
    }

    const item = await createFaqItem({
      question: question.trim(),
      answer: answer.trim(),
    });
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, question, answer, active } = (await request.json()) as {
      id?: string;
      question?: string;
      answer?: string;
      active?: boolean;
    };

    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    const item = await updateFaqItem(id, {
      question: question?.trim(),
      answer: answer?.trim(),
      active,
    });
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });
    }

    await deleteFaqItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאת שרת";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "אין הרשאה" : message },
      { status },
    );
  }
}

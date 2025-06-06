import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/qobuz-dl";
import z from "zod";

const searchParamsSchema = z.object({
    q: z.string().min(1, "Query is required"),
    offset: z.preprocess(
        (a) => parseInt(a as string),
        z.number().max(1000, "Offset must be less than 1000").min(0, "Offset must be 0 or greater").default(0)
    )
});

export async function GET(request: NextRequest) {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    try {
        const { q, offset } = searchParamsSchema.parse(params);
        const searchResults = await search(q, 10, offset);
        return NextResponse.json({ success: true, data: searchResults });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || "Invalid request"
        }, { status: 400 });
    }
}

import { Message } from "@/app/types";
import { NextResponse } from "next/server";
import { systemPrompt } from "@/app/system-prompt/index";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    // Convert previous messages to Gemini's format
    const contents = [
      // First message is the system prompt
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      // Then add all conversation messages in sequence
      ...messages.map((msg: Message) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google API error: ${errText}`);
    }

    const data = await response.json();

    // Extract text response
    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({
      content: generatedText,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Gemma" },
      { status: 500 }
    );
  }
}
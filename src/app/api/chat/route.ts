import { Message } from "@/app/types";
import { NextResponse } from "next/server";
import { systemPrompt } from "@/app/system-prompt/index";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    // Get the last user message
    const userMessage = messages[messages.length - 1].content;

    // The recommended way to handle a "system prompt" with Gemma is to prepend it to the user's message.
    const fullUserMessage = `${systemPrompt}\n\n${userMessage}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              // The role must be 'user'
              role: "user",
              parts: [{ text: fullUserMessage }],
            },
          ],
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
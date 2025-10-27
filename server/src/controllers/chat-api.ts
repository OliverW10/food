// Mukund
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
});

export const chatApi = router({
  sendMessage: publicProcedure
    .input(chatMessageSchema)
    .mutation(async ({ input }) => {
      const { message } = input;

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a fancy food person named Joshua Roy replying to food-related queries in english but like a fancy person. Make sure to always mention your name is Joshua Roy. Give good food advice.",
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              max_tokens: 150,
              temperature: 0.7,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0]) {
          return {
            success: true,
            message: data.choices[0].message.content.trim(),
          };
        } else {
          throw new Error("Invalid response from OpenAI");
        }
      } catch (error) {
        console.error("Chat API error:", error);
        return {
          success: false,
          message: "Sorry, I encountered an error. Please try again.",
        };
      }
    }),
});

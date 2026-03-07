import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert textile material classifier. Given an image of a fabric or textile item, identify the material type and provide recycling guidance.

You MUST respond by calling the classify_fabric function with accurate information. Identify one primary material from these categories: Cotton, Denim, Polyester, Silk, Wool, Leather, Nylon, Linen, or Mixed/Blended.

Be specific and helpful with recycling guidance. Consider the material's properties for accurate environmental impact assessment.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this fabric/textile image and classify the material type. Provide recycling guidance.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "classify_fabric",
                description:
                  "Classify the fabric material and provide recycling guidance",
                parameters: {
                  type: "object",
                  properties: {
                    material: {
                      type: "string",
                      description:
                        "The identified fabric material (e.g., Cotton, Denim, Polyester, Silk, Wool, Leather, Nylon, Linen, Mixed/Blended)",
                    },
                    confidence: {
                      type: "number",
                      description:
                        "Confidence level of the classification (0-100)",
                    },
                    recyclable: {
                      type: "boolean",
                      description: "Whether the material is recyclable",
                    },
                    biodegradable: {
                      type: "boolean",
                      description: "Whether the material is biodegradable",
                    },
                    guidance: {
                      type: "string",
                      description:
                        "Detailed recycling or disposal guidance for this material",
                    },
                    tips: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "3-4 actionable tips for recycling or repurposing this material",
                    },
                    environmental_impact: {
                      type: "string",
                      description:
                        "Brief description of the environmental impact of this material",
                    },
                  },
                  required: [
                    "material",
                    "confidence",
                    "recyclable",
                    "biodegradable",
                    "guidance",
                    "tips",
                    "environmental_impact",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "classify_fabric" },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No classification result returned");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("classify-fabric error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

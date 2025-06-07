
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userText } = await req.json();

    if (!userText || userText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'User text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent registration assistant for a Moroccan freelance platform called "Mistrfix".

Your job is to extract structured profile information from a short paragraph written in Arabic or Moroccan Darija. The user will describe themselves — their name, profession, city, and experience. Extract as much information as possible.

Return ONLY a valid JSON object with the following fields:
- full_name (string)
- profession (string) 
- city (string)
- experience_years (number)

If a value is missing or unclear, use null.

Example input:
"أنا اسمي حمزة، سبّاك من مراكش، عندي ٥ سنين ديال التجربة."

Expected output:
{
  "full_name": "حمزة",
  "profession": "سبّاك", 
  "city": "مراكش",
  "experience_years": 5
}`
          },
          {
            role: 'user',
            content: userText
          }
        ],
        functions: [
          {
            name: "extract_user_profile",
            description: "Extract user profile data from natural language registration sentence",
            parameters: {
              type: "object",
              properties: {
                full_name: {
                  type: "string",
                  description: "The full name of the user"
                },
                profession: {
                  type: "string",
                  description: "The user's main profession (e.g., سبّاك, كهربائي)"
                },
                city: {
                  type: "string",
                  description: "The city where the user is located"
                },
                experience_years: {
                  type: "number",
                  description: "How many years of experience the user has"
                }
              },
              required: ["full_name", "profession", "city"]
            }
          }
        ],
        function_call: { name: "extract_user_profile" },
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'OpenAI API error');
    }

    let extractedData;
    if (data.choices?.[0]?.function_call?.arguments) {
      try {
        extractedData = JSON.parse(data.choices[0].function_call.arguments);
      } catch (e) {
        throw new Error('Failed to parse extracted data');
      }
    } else if (data.choices?.[0]?.message?.content) {
      try {
        extractedData = JSON.parse(data.choices[0].message.content);
      } catch (e) {
        throw new Error('Failed to parse response content');
      }
    } else {
      throw new Error('No valid response from OpenAI');
    }

    // Validate required fields
    if (!extractedData.full_name || !extractedData.profession || !extractedData.city) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not extract required information. Please provide your name, profession, and city.',
          extracted: extractedData 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-profile function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

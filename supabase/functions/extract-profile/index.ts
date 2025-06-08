
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    console.log('Extract-profile function called');
    
    if (!geminiApiKey) {
      console.error('Gemini API key not found in environment');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userText } = await req.json();
    console.log('Received user text:', userText);

    if (!userText || userText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'User text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Making request to Gemini API');
    
    const prompt = `You are an intelligent registration assistant for a Moroccan freelance platform called "Mistrfix".

Your job is to extract structured profile information from a short paragraph written in Arabic or Moroccan Darija. The user will describe themselves — their name, profession, city, and experience. Extract as much information as possible.

Return ONLY a valid JSON object with the following fields:
- full_name (string)
- profession (string) 
- city (string)
- experience_years (number, or null if not mentioned)

If a value is missing or unclear, use null for numbers or an empty string for text fields.

Example input:
"أنا اسمي حمزة، سبّاك من مراكش، عندي ٥ سنين ديال التجربة."

Expected output:
{
  "full_name": "حمزة",
  "profession": "سبّاك", 
  "city": "مراكش",
  "experience_years": 5
}

IMPORTANT: Return ONLY the JSON object, no additional text or formatting.

User input: ${userText}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      }),
    });

    console.log('Gemini response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response data:', data);
    
    if (data.error) {
      console.error('Gemini returned error:', data.error);
      throw new Error(data.error.message || 'Gemini API error');
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid Gemini response structure:', data);
      throw new Error('Invalid response from Gemini');
    }

    const content = data.candidates[0].content.parts[0].text;
    console.log('Gemini content:', content);

    let extractedData;
    try {
      // Clean up the response text to extract just the JSON
      const cleanContent = content.replace(/```json|```/g, '').trim();
      extractedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', content);
      throw new Error('Failed to parse extracted data. Please try rephrasing your description.');
    }

    // Validate required fields
    if (!extractedData.full_name || !extractedData.profession || !extractedData.city) {
      console.error('Missing required fields in extracted data:', extractedData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract required information. Please provide your name, profession, and city.',
          extracted: extractedData 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully extracted data:', extractedData);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-profile function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

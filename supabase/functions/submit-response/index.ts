import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function hashIp(ip: string, secret: string) {
  const bytes = new TextEncoder().encode(`${secret}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const rateSecret = Deno.env.get("RATE_LIMIT_SECRET");
    if (!url || !serviceKey || !rateSecret) return json({ error: "Server configuration error" }, 500);

    // Before relying on this for production rate limiting, verify that x-forwarded-for
    // is set by trusted infrastructure; never trust a user-controlled IP header.
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim();
    if (!ip) return json({ error: "Cannot identify request source" }, 400);

    const body = await req.json();
    if (typeof body.website === "string" && body.website.length > 0) return json({ ok: true });

    const answer = body.answer;
    const choice = body.date_choice;
    const date = body.date_option;
    const time = body.time_option;
    const note = body.note;

    if (answer !== "yes" && answer !== "no") return json({ error: "Invalid answer" }, 400);
    if (
      (choice != null && (typeof choice !== "string" || choice.length > 100)) ||
      (date != null && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) ||
      (time != null && (typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time))) ||
      (note != null && (typeof note !== "string" || note.length > 1000))
    ) return json({ error: "Invalid input" }, 400);

    if (answer === "yes" && (typeof choice !== "string" || choice.length === 0)) {
      return json({ error: "Choose a date idea" }, 400);
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const ipHash = await hashIp(ip, rateSecret);
    const { data: allowed, error: limitError } = await supabase.rpc(
      "allow_response_submission",
      { p_ip_hash: ipHash },
    );
    if (limitError) {
      console.error("Rate limit check failed:", limitError.message);
      return json({ error: "Could not verify request limit" }, 500);
    }
    if (allowed !== true) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);

    const { error: insertError } = await supabase.from("responses").insert({
      answer,
      date_choice: answer === "yes" ? choice : null,
      date_option: answer === "yes" ? date || null : null,
      time_option: answer === "yes" ? time || null : null,
      note: typeof note === "string" && note.trim() ? note.trim() : null,
    });
    if (insertError) {
      console.error("Response insert failed:", insertError.message);
      return json({ error: "Could not save response" }, 500);
    }
    return json({ ok: true });
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
});

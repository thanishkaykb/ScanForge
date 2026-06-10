import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/r/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!id || !/^[0-9a-f-]{10,40}$/i.test(id)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin
          .from("qr_history")
          .select("qr_type,data,active")
          .eq("id", id)
          .maybeSingle();
        if (error || !row) return new Response("Not found", { status: 404 });

        if (!row.active) {
          return new Response(
            `<!doctype html><meta charset="utf-8"><title>QR deactivated</title>
<style>body{font-family:system-ui;background:#0f0817;color:#eee;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;margin:0}.card{max-width:420px;background:#1c1130;border:1px solid #3b2160;border-radius:16px;padding:32px}h1{color:#c4a4ff;margin:0 0 8px;font-size:22px}p{color:#aaa;margin:0}</style>
<div class="card"><h1>This QR code has been deactivated</h1><p>The owner turned it off. It will work again if they reactivate it from their history.</p></div>`,
            { status: 410, headers: { "content-type": "text/html; charset=utf-8" } },
          );
        }

        const fileTypes = new Set(["image", "pdf", "docs", "mp3"]);
        if (fileTypes.has(row.qr_type) && !row.data.startsWith("http")) {
          // data is a storage object path; sign a temporary URL and redirect
          const { data: signed } = await supabaseAdmin.storage
            .from("qr-files")
            .createSignedUrl(row.data, 60 * 60);
          if (!signed?.signedUrl) return new Response("File missing", { status: 404 });
          return Response.redirect(signed.signedUrl, 302);
        }
        return Response.redirect(row.data, 302);
      },
    },
  },
});

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

// O watsonx Assistant envia a chave no header x-api-key (configurado na extensão)
export function isAuthorized(request: Request) {
  const expected = process.env.ASSISTANT_API_KEY;
  if (!expected) return false;

  const received = Buffer.from(request.headers.get("x-api-key") ?? "");
  const secret = Buffer.from(expected);

  return received.length === secret.length && timingSafeEqual(received, secret);
}

export function unauthorized() {
  return NextResponse.json(
    { ok: false, message: "Chave de acesso do assistente inválida." },
    { status: 401 }
  );
}

// Resultados de negócio voltam sempre com HTTP 200 e uma mensagem pronta para
// o chatbot exibir; assim cada action só precisa mostrar body.message
export function reply(ok: boolean, message: string, data: object = {}) {
  return NextResponse.json({ ok, message, ...data });
}

export function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export function serverError(error: unknown) {
  console.error("Erro na API do assistente:", error);

  return NextResponse.json(
    {
      ok: false,
      message:
        "Tive um problema para acessar o ReUse agora. Tente novamente em alguns minutos.",
    },
    { status: 500 }
  );
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

export function baseUrl(request: Request) {
  return process.env.PUBLIC_BASE_URL || new URL(request.url).origin;
}

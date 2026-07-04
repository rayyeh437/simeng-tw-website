export const dynamic = 'force-dynamic';

/**
 * Next.js API 代理路由
 * 用於通過 Fixie 固定 IP 代理轉發 API 請求
 */

import { HttpsProxyAgent } from "https-proxy-agent";

const FIXIE_URL = process.env.NEXT_PUBLIC_FIXIE_URL || "";
const FIXIE_PROXY_TYPE = process.env.NEXT_PUBLIC_FIXIE_PROXY_TYPE || "http";

/**
 * 建立代理 Agent
 */
function createProxyAgent() {
  if (!FIXIE_URL) {
    return null;
  }

  // 目前只支持 HTTP 代理
  return new HttpsProxyAgent(FIXIE_URL);
}

/**
 * 處理 GET 請求
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing url parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[ProxyAPI] GET 請求:", targetUrl);

    const agent = createProxyAgent();
    const fetchOptions: any = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // 如果配置了代理，使用代理發送請求
    if (agent) {
      console.log("[ProxyAPI] 使用 Fixie 代理發送請求");
      fetchOptions.agent = agent;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[ProxyAPI] 錯誤:", error);
    return new Response(
      JSON.stringify({
        error: "Proxy request failed",
        message: (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * 處理 POST 請求
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing url parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[ProxyAPI] POST 請求:", targetUrl);

    const body = await request.json();
    const agent = createProxyAgent();

    const fetchOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    // 如果配置了代理，使用代理發送請求
    if (agent) {
      console.log("[ProxyAPI] 使用 Fixie 代理發送請求");
      fetchOptions.agent = agent;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[ProxyAPI] 錯誤:", error);
    return new Response(
      JSON.stringify({
        error: "Proxy request failed",
        message: (error as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

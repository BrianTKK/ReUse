import Script from "next/script";
import { connection } from "next/server";

// Web chat do watsonx Assistant. Os IDs vêm de Integrations > Web chat > Embed
// e são públicos (aparecem no HTML de qualquer site que usa o widget).
export default async function WatsonChat() {
  await connection();

  const integrationID = process.env.WATSON_INTEGRATION_ID;
  const region = process.env.WATSON_REGION;
  const serviceInstanceID = process.env.WATSON_SERVICE_INSTANCE_ID;

  if (!integrationID || !region || !serviceInstanceID) {
    return null;
  }

  // No AI assistant builder do watsonx Orchestrate o "region" do snippet é uma URL
  const options = JSON.stringify({
    integrationID,
    region,
    serviceInstanceID,
    orchestrateUIAgentExtensions: false,
  });

  return (
    <Script id="watson-web-chat" strategy="afterInteractive">
      {`
        window.watsonAssistantChatOptions = Object.assign(${options}, {
          onLoad: async (instance) => { await instance.render(); },
        });
        const script = document.createElement("script");
        script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
        document.head.appendChild(script);
      `}
    </Script>
  );
}

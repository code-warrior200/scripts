import { NextResponse } from "next/server";
import { getSampleFarms, getSampleCrops } from "../../../lib/data";

type ChatMessage = {
  role?: string;
  content?: string;
};

function normalizeMessage(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function getAssistantReply(message: string) {
  const farms = getSampleFarms();
  const crops = getSampleCrops();
  const attentionFarms = farms.filter((farm: { status: string }) => farm.status.toLowerCase() !== "healthy");

  if (!message) {
    return "Ask me about farm status, crop actions, subscriptions, or where to find something in AgriSaaS.";
  }

  if (message.includes("attention") || message.includes("issue") || message.includes("status") || message.includes("irrigation")) {
    if (attentionFarms.length === 0) {
      return "All farms are marked healthy. Keep monitoring moisture, irrigation, and upcoming harvest work from the Farms and Crops pages.";
    }

    const summary = attentionFarms.map((farm: { name: string; region: string; status: string }) => `${farm.name} in ${farm.region}: ${farm.status}`).join("; ");
    return `These farms need attention: ${summary}. Start with the Farms page, then check crop-level next actions for the affected fields.`;
  }

  if (message.includes("crop") || message.includes("action") || message.includes("task") || message.includes("harvest")) {
    const summary = crops.map((crop: { name: string; farm: string; nextAction: string }) => `${crop.name} at ${crop.farm}: ${crop.nextAction}`).join("; ");
    return `Current crop actions are: ${summary}. Use the Crops page to review acreage and prioritize work by farm.`;
  }

  if (message.includes("farm") || message.includes("location") || message.includes("region")) {
    const summary = farms.map((farm: { name: string; region: string; crops: string[]; status: string }) => `${farm.name} (${farm.region}, ${farm.crops.length} crops, ${farm.status})`).join("; ");
    return `You have ${farms.length} farms in AgriSaaS: ${summary}.`;
  }

  if (message.includes("subscription") || message.includes("billing") || message.includes("plan") || message.includes("premium")) {
    return "Your current subscription is Premium. Go to Settings, then Manage subscription to update billing or plan details.";
  }

  if (message.includes("help") || message.includes("support") || message.includes("contact")) {
    return "I can help with farm status, crop actions, navigation, and subscription questions. For account-specific support, use Settings to manage subscription details.";
  }

  return "I can help with farms, crops, operational tasks, and subscription questions. Try asking which farms need attention or what crop actions are due.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const latestMessage = body.messages?.filter((message) => message.role === "user").at(-1);
    const reply = getAssistantReply(normalizeMessage(latestMessage?.content));

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: getAssistantReply("") }, { status: 400 });
  }
}
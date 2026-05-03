"use client";

import { FormEvent, useRef, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I am your AgriSaaS customer assistant. Ask me about farms, crops, subscriptions, or what needs attention today.",
  },
];

const quickPrompts = [
  "Which farms need attention?",
  "Summarize crop actions",
  "How do I manage my subscription?",
];

export function CustomerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(message: string) {
    const trimmed = message.trim();

    if (!trimmed || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { reply?: string };
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? "I could not prepare a response." }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I am having trouble responding right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function openAssistant() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="assistant">
      {isOpen ? (
        <section className="assistant-panel" aria-label="Customer assistant">
          <header className="assistant-header">
            <div>
              <strong>AI Customer Assistant</strong>
              <span>Online</span>
            </div>
            <button className="assistant-icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">
              x
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`assistant-message ${message.role === "assistant" ? "bot" : "user"}`} key={`${message.role}-${index}`}>
                {message.content}
              </div>
            ))}
            {isSending ? <div className="assistant-message bot">Thinking...</div> : null}
          </div>

          <div className="assistant-prompts">
            {quickPrompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => void sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="assistant-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
              aria-label="Message"
            />
            <button className="primary" type="submit" disabled={isSending || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      ) : (
        <button className="assistant-launcher" type="button" onClick={openAssistant} aria-label="Open customer assistant">
          AI
        </button>
      )}
    </div>
  );
}

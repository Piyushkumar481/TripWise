import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bot,
  MessageCircle,
  Send,
  User,
  Sparkles,
  LoaderCircle,
  X,
} from "lucide-react";

import { sendTravelChatMessage } from "../services/aiTravelChatService";
import "./AITravelChat.css";

function AITravelChat({ itineraryId = null }) {
  const messagesContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: itineraryId
        ? "Hi! I'm TripWise AI. Ask me about your saved trip or any other travel question."
        : "Hi! I'm TripWise AI. Ask me about destinations, budgets, hotels, transport, itineraries, packing or anything related to travel.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  async function handleSend(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: "user", content: message },
    ]);

    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await sendTravelChatMessage(
        itineraryId ?? null,
        message
      );

      if (!response?.answer?.trim()) {
        throw new Error("TripWise AI returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);

    } catch (err) {
      console.error("TripWise travel chat failed:", err);

      if ([401, 403].includes(err?.response?.status)) {
        setError("Please log in to use TripWise AI.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to contact TripWise AI. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="tw-ai-widget">

      {isOpen && (
        <section
          className="tw-ai-panel"
          role="dialog"
          aria-label="TripWise AI travel assistant"
        >

          <header className="tw-ai-header">

            <div className="tw-ai-brand">

              <div className="tw-ai-brand-icon">
                <Sparkles size={21} />
              </div>

              <div className="tw-ai-brand-text">
                <strong>TripWise AI</strong>
                <span>Your personal travel assistant</span>
              </div>

            </div>

            <button
              type="button"
              className="tw-ai-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={19} />
            </button>

          </header>

          <div className="tw-ai-context">
            <span className="tw-ai-context-dot" />

            {itineraryId
              ? "Your saved itinerary is available as context"
              : "Ask anything about travel — no itinerary needed"}
          </div>

          <div
            className="tw-ai-messages"
            ref={messagesContainerRef}
            aria-live="polite"
            aria-label="Chat conversation"
          >

            {messages.map((message, index) => (

              <div
                className={`tw-ai-message ${message.role}`}
                key={`${message.role}-${index}`}
              >

                <div className="tw-ai-message-icon">

                  {message.role === "assistant" ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )}

                </div>

                <div className="tw-ai-bubble">

                  <span>
                    {message.role === "assistant" ? "TripWise AI" : "You"}
                  </span>

                  <p>{message.content}</p>

                </div>

              </div>

            ))}

            {loading && (

              <div className="tw-ai-message assistant">

                <div className="tw-ai-message-icon">
                  <Bot size={16} />
                </div>

                <div className="tw-ai-bubble">

                  <span>TripWise AI</span>

                  <div className="tw-ai-typing">
                    <i />
                    <i />
                    <i />
                  </div>

                  <small>Thinking about your question...</small>

                </div>

              </div>

            )}

          </div>

          {error && (
            <div className="tw-ai-error" role="alert">
              {error}
            </div>
          )}

          <form className="tw-ai-form" onSubmit={handleSend}>

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything about travel..."
              maxLength={2000}
              disabled={loading}
              aria-label="Your travel question"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >

              {loading ? (
                <LoaderCircle
                  size={19}
                  className="tw-ai-spinner"
                />
              ) : (
                <Send size={18} />
              )}

            </button>

          </form>

          <div className="tw-ai-disclaimer">
            AI suggestions may need independent verification.
          </div>

        </section>
      )}

      <button
        type="button"
        className={`tw-ai-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close TripWise AI" : "Open TripWise AI"}
      >

        {isOpen ? (
          <X size={20} />
        ) : (
          <MessageCircle size={21} />
        )}

        <span>
          {isOpen ? "Close assistant" : "Ask TripWise AI"}
        </span>

        {!isOpen && (
          <span className="tw-ai-launcher-dot" />
        )}

      </button>

    </div>,
    document.body
  );
}

export default AITravelChat;
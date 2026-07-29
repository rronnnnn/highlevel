"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { contact } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email.";
    if (!message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full border-t border-hairline bg-background px-6 py-24 md:py-32"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.h2
          className="display-heavy text-[10vw] leading-none text-foreground sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {contact.heading}
        </motion.h2>

        {status === "success" ? (
          <p className="mt-14 text-lg text-foreground-dim/90">
            {contact.successMessage}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-14 flex w-full flex-col gap-6 text-left"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="meta-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b border-hairline bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground"
                autoComplete="name"
              />
              {errors.name && (
                <span className="text-xs text-foreground-dim/70">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="meta-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-hairline bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground"
                autoComplete="email"
              />
              {errors.email && (
                <span className="text-xs text-foreground-dim/70">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="meta-label">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none border-b border-hairline bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground"
              />
              {errors.message && (
                <span className="text-xs text-foreground-dim/70">
                  {errors.message}
                </span>
              )}
            </div>

            {status === "error" && (
              <p className="text-sm text-foreground-dim/80">
                Something went wrong sending your message. Please try again or
                reach us directly at mkhighlevel@gmail.com.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-4 self-center rounded-full border border-foreground px-8 py-4 text-sm font-medium uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

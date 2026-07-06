"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type Ref,
} from "react";
import Link from "next/link";
import { siteConfig } from "../site";
import {
  MAX_LENGTHS,
  METHOD_META,
  SEND_HINT,
  SEND_HINT_MAC,
  STEP_ORDER,
  isSendShortcut,
  type ContactStep,
} from "./contact.constants";
import { isValidContactValue } from "./contact.validation";
import { useContactForm, type ContactFormApi } from "./useContactForm";
import type { ContactMethod } from "./contact.types";

// The operator booth's accent: a comms-line teal, distinct from the three
// cabinets on the floor (leaf green / cyan / pink) and the resting amber.
const OPERATOR_ACCENT = "#5fd1c4";
const ERROR_INK = "#ff7a93";

function reached(step: ContactStep, target: ContactStep): boolean {
  return STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(target);
}

function done(step: ContactStep, target: ContactStep): boolean {
  return STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf(target);
}

const subscribeNoop = () => () => {};
const getIsMacSnapshot = () =>
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.platform || "");

// `useSyncExternalStore` reads the platform on the client only (server snapshot
// is `false`), avoiding both a hydration mismatch and a setState-in-effect.
function useIsMac(): boolean {
  return useSyncExternalStore(subscribeNoop, getIsMacSnapshot, () => false);
}

/** A shell prompt line: `operator@ssharcade.dev:~/booth$ <cmd>`. */
function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs sm:text-sm">
      <span className="text-[var(--cabinet-accent)]">operator@{siteConfig.domain}</span>
      <span className="text-[#f8f1dc]/50">:</span>
      <span className="text-[#f8f1dc]/80">~/booth</span>
      <span className="text-[#f8f1dc]/50">$ </span>
      <span className="text-[#f8f1dc]">{children}</span>
    </p>
  );
}

/** A read-back row shown once a step is answered. */
function EchoRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <p className="flex gap-3 text-xs sm:text-sm">
      <span className="w-24 shrink-0 text-[var(--cabinet-accent)]">{label}</span>
      <span className={muted ? "text-[#f8f1dc]/45" : "text-[#f8f1dc]"}>{value}</span>
    </p>
  );
}

interface TerminalInputProps {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  invalid?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

function TerminalInput({
  id,
  label,
  optional,
  value,
  onChange,
  onKeyDown,
  type = "text",
  inputMode = "text",
  autoComplete,
  placeholder,
  disabled,
  maxLength,
  invalid,
  inputRef,
}: TerminalInputProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#f8f1dc]/55">
        {label}
        {optional ? <span className="text-[10px] tracking-normal normal-case text-[#f8f1dc]/35">{"// optional"}</span> : null}
      </span>
      <div
        className={`flex items-center gap-2 rounded-lg border-2 bg-[#0d0c08] px-3 py-2 transition-colors duration-200 ${
          disabled
            ? "cursor-not-allowed border-[#f8f1dc]/15 opacity-50"
            : invalid
              ? "border-[var(--error-ink)] focus-within:border-[var(--error-ink)]"
              : "border-[#f8f1dc]/20 focus-within:border-[var(--cabinet-accent)]"
        }`}
      >
        <span aria-hidden className={disabled ? "text-[#f8f1dc]/40" : "text-[var(--cabinet-accent)]"}>
          &gt;
        </span>
        <input
          ref={inputRef}
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={invalid || undefined}
          className="w-full bg-transparent font-mono text-sm text-[#f8f1dc] outline-none placeholder:text-[#f8f1dc]/35 disabled:cursor-not-allowed"
        />
      </div>
    </label>
  );
}

function NextButton({
  onClick,
  disabled,
  label = "next",
}: {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group mt-1 inline-flex items-center gap-2 rounded-full border-2 border-[var(--cabinet-accent)] bg-[var(--cabinet-accent)]/15 px-5 py-2 font-mono text-sm font-black uppercase tracking-[0.14em] text-[var(--cabinet-accent)] transition-colors duration-200 hover:enabled:bg-[var(--cabinet-accent)] hover:enabled:text-[#0d0c08] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span>{label}</span>
      <span aria-hidden className="transition-transform duration-200 group-hover:enabled:translate-x-0.5">
        ▸
      </span>
    </button>
  );
}

function IdentityStep({ api }: { api: ContactFormApi }) {
  const active = api.step === "identity";
  const isDone = done(api.step, "identity");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => nameRef.current?.focus(), 500);
    return () => window.clearTimeout(id);
  }, [active]);

  if (isDone) {
    return (
      <div className="term-welcome space-y-1.5">
        <Prompt>whoami --register</Prompt>
        <EchoRow label="callsign" value={api.values.name} />
        <EchoRow label="crew" value={api.values.company || "— solo —"} muted={!api.values.company} />
      </div>
    );
  }

  return (
    <div className="term-welcome space-y-4">
      <Prompt>whoami --register</Prompt>
      <div className="space-y-4">
        <TerminalInput
          id="contact-name"
          label="callsign"
          value={api.values.name}
          onChange={api.setName}
          autoComplete="name"
          placeholder="ada_lovelace"
          maxLength={MAX_LENGTHS.name}
          inputRef={nameRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              api.advance();
            }
          }}
        />
        <TerminalInput
          id="contact-company"
          label="crew"
          optional
          value={api.values.company}
          onChange={api.setCompany}
          autoComplete="organization"
          placeholder="night-ops"
          maxLength={MAX_LENGTHS.company}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              api.advance();
            }
          }}
        />
        <NextButton onClick={api.advance} disabled={!api.identityValid} />
      </div>
    </div>
  );
}

function MethodButton({
  method,
  selected,
  onSelect,
}: {
  method: ContactMethod;
  selected: boolean;
  onSelect: (method: ContactMethod) => void;
}) {
  const meta = METHOD_META[method];
  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      aria-pressed={selected}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-mono text-sm font-black uppercase tracking-[0.12em] transition-colors duration-200 active:translate-y-0.5 ${
        selected
          ? "border-[var(--cabinet-accent)] bg-[var(--cabinet-accent)]/20 text-[var(--cabinet-accent)]"
          : "border-[#f8f1dc]/20 bg-[#0d0c08] text-[#f8f1dc]/55 hover:border-[var(--cabinet-accent)]/60 hover:text-[#f8f1dc]"
      }`}
    >
      <span aria-hidden>{selected ? "[x]" : "[ ]"}</span>
      {meta.label}
    </button>
  );
}

function MethodStep({ api }: { api: ContactFormApi }) {
  const active = api.step === "method";
  const isDone = done(api.step, "method");
  const reachedStep = reached(api.step, "method");
  const entryRef = useRef<HTMLInputElement>(null);
  const method = api.values.method;

  useEffect(() => {
    if (active && method) {
      const id = window.setTimeout(() => entryRef.current?.focus(), 120);
      return () => window.clearTimeout(id);
    }
  }, [active, method]);

  if (!reachedStep) return null;

  if (isDone && method) {
    const meta = METHOD_META[method];
    return (
      <div className="term-welcome space-y-1.5">
        <Prompt>set --reply-channel</Prompt>
        <EchoRow label="channel" value={meta.label} />
        <EchoRow label={meta.label.toLowerCase()} value={api.values.contactValue} />
      </div>
    );
  }

  const meta = method ? METHOD_META[method] : null;
  const showInvalid =
    method !== null &&
    api.values.contactValue.trim().length > 0 &&
    !isValidContactValue(method, api.values.contactValue);

  return (
    <div className="term-welcome space-y-4">
      <Prompt>set --reply-channel</Prompt>
      <p className="font-mono text-xs text-[#f8f1dc]/60">How should the operator ring you back?</p>
      <div className="flex gap-3">
        <MethodButton method="email" selected={method === "email"} onSelect={api.selectMethod} />
        <MethodButton method="phone" selected={method === "phone"} onSelect={api.selectMethod} />
      </div>

      <TerminalInput
        id="contact-value"
        label={meta ? meta.label : "channel"}
        value={api.values.contactValue}
        onChange={api.setContactValue}
        disabled={method === null}
        type={meta ? meta.inputType : "text"}
        inputMode={meta ? meta.inputMode : "text"}
        autoComplete={meta ? meta.autoComplete : undefined}
        placeholder={meta ? meta.placeholder : "select a channel above first…"}
        maxLength={MAX_LENGTHS.contactValue}
        invalid={showInvalid}
        inputRef={entryRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            api.advance();
          }
        }}
      />

      {showInvalid ? (
        <p className="font-mono text-xs text-[var(--error-ink)]">
          {method === "email"
            ? "That doesn't look like a valid email address."
            : "That doesn't look like a valid phone number."}
        </p>
      ) : null}

      <NextButton onClick={api.advance} disabled={!api.methodValid} />
    </div>
  );
}

function MessageStep({ api }: { api: ContactFormApi }) {
  const active = api.step === "message";
  const reachedStep = reached(api.step, "message");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMac = useIsMac();
  const sending = api.status === "sending";

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!reachedStep || api.step === "result") return null;

  return (
    <div className="term-welcome space-y-3">
      <Prompt>compose --transmission</Prompt>
      <div className="overflow-hidden rounded-lg border-2 border-[#f8f1dc]/20 bg-[#0d0c08] focus-within:border-[var(--cabinet-accent)]">
        <div className="flex items-center justify-between border-b-2 border-[#f8f1dc]/15 px-3 py-1.5">
          <span className="font-mono text-[11px] text-[#f8f1dc]/50">transmission.txt</span>
          <span className="font-mono text-[11px] text-[#f8f1dc]/45">
            {api.values.message.length}/{MAX_LENGTHS.message}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={api.values.message}
          maxLength={MAX_LENGTHS.message}
          rows={5}
          disabled={sending}
          onChange={(e) => api.setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (isSendShortcut(e)) {
              e.preventDefault();
              if (api.messageValid && !sending) void api.submit();
            }
          }}
          placeholder="Type your transmission, then send…"
          className="block w-full resize-y bg-transparent px-3 py-2.5 font-mono text-sm text-[#f8f1dc] outline-none placeholder:text-[#f8f1dc]/35 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-[#f8f1dc]/55">
          Press{" "}
          <kbd className="rounded border-2 border-[#f8f1dc]/25 px-1.5 py-0.5 text-[10px] text-[#f8f1dc]">
            {isMac ? SEND_HINT_MAC : SEND_HINT}
          </kbd>{" "}
          to send
        </p>
        <button
          type="button"
          onClick={() => void api.submit()}
          disabled={!api.messageValid || sending}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--cabinet-accent)] bg-[var(--cabinet-accent)]/15 px-5 py-2 font-mono text-sm font-black uppercase tracking-[0.14em] text-[var(--cabinet-accent)] transition-colors duration-200 hover:enabled:bg-[var(--cabinet-accent)] hover:enabled:text-[#0d0c08] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? (
            <>
              <span className="blink">▋</span>
              transmitting…
            </>
          ) : (
            <>
              <span aria-hidden>▴</span>
              send
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ResultStep({ api }: { api: ContactFormApi }) {
  if (api.step !== "result") return null;
  const success = api.status === "success";
  const channelLabel = api.values.method
    ? METHOD_META[api.values.method].label.toLowerCase()
    : "your channel";

  return (
    <div className="term-welcome space-y-3" aria-live="polite">
      <Prompt>transmit</Prompt>
      {success ? (
        <div className="space-y-3 rounded-lg border-2 border-[var(--cabinet-accent)]/50 bg-[var(--cabinet-accent)]/10 p-5">
          <p className="font-display text-lg font-black uppercase tracking-[0.04em] text-[var(--cabinet-accent)]">
            ✓ Transmission received
          </p>
          <p className="font-mono text-sm leading-relaxed text-[#f8f1dc]">
            Thanks, {api.values.name.split(" ")[0] || api.values.name}. Your message reached the
            operator booth — expect a ring back via {channelLabel} as soon as a coin drops.
          </p>
          <p className="font-mono text-xs text-[#f8f1dc]/55">process exited with code 0</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#f8f1dc]/25 px-4 py-2 font-mono text-sm text-[#f8f1dc] transition-colors duration-200 hover:border-[var(--cabinet-accent)] hover:text-[var(--cabinet-accent)]"
          >
            <span aria-hidden>←</span> back to the arcade floor
          </Link>
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border-2 border-[var(--error-ink)]/50 bg-[var(--error-ink)]/10 p-5">
          <p className="font-display text-lg font-black uppercase tracking-[0.04em] text-[var(--error-ink)]">
            ✗ Transmission failed
          </p>
          <p className="font-mono text-sm leading-relaxed text-[#f8f1dc]">
            {api.errorMessage ?? "Something went wrong at the booth."}
          </p>
          <p className="font-mono text-sm leading-relaxed text-[#f8f1dc]/65">
            Try again, or reach the operator directly:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={api.retry}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--cabinet-accent)] bg-[var(--cabinet-accent)]/15 px-4 py-2 font-mono text-sm font-black uppercase tracking-[0.12em] text-[var(--cabinet-accent)] transition-colors duration-200 hover:bg-[var(--cabinet-accent)] hover:text-[#0d0c08]"
            >
              <span aria-hidden>↻</span> retry
            </button>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#f8f1dc]/25 px-4 py-2 font-mono text-sm text-[#f8f1dc] transition-colors duration-200 hover:border-[var(--cabinet-accent)] hover:text-[var(--cabinet-accent)]"
            >
              email the operator
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function stepBadge(step: ContactStep, status: ContactFormApi["status"]): string {
  switch (step) {
    case "identity":
      return "01 / callsign";
    case "method":
      return "02 / channel";
    case "message":
      return "03 / message";
    case "result":
      return status === "success" ? "transmitted" : "error";
  }
}

export default function OperatorTerminal() {
  const api = useContactForm();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Keep the newest prompt in view as the session grows.
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [api.step]);

  return (
    <main
      className="theme-root min-h-screen overflow-hidden bg-[#d7d1c3] text-[#17150f]"
      style={
        {
          "--accent": OPERATOR_ACCENT,
          "--cabinet-accent": OPERATOR_ACCENT,
          "--error-ink": ERROR_INK,
        } as CSSProperties
      }
    >
      <div aria-hidden="true" className="arcade-backdrop fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply grain" />

      {/* ---- Status bar ---- */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border-4 border-[#17150f] bg-[#ede4ce] p-3 shadow-[4px_4px_0_#17150f] sm:shadow-[8px_8px_0_#17150f]">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
          >
            <span aria-hidden="true">←</span> Arcade floor
          </Link>
          <div className="flex items-center gap-2 font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#5c523d] sm:text-xs">
            <span className="hidden rounded-full border-2 border-[#17150f] bg-[var(--accent)] px-3 py-1 text-[#17150f] sm:inline">
              OP-00
            </span>
            <span className="hidden sm:inline">Operator on duty</span>
            <span className="rounded-full bg-[#17150f] px-3 py-1 text-[var(--accent)]">Booth</span>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <p className="mb-4 inline-flex rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">
          Cabinet OP-00 / operator booth
        </p>
        <h1 className="max-w-4xl text-balance font-display text-[clamp(2.75rem,9vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
          Page the operator.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-[#433c2d] sm:text-xl">
          Found a bug, want a cabinet on the floor, or just want to say hello? Open a line to the
          operator booth. Answer each prompt in the terminal below and your transmission routes
          straight to the arcade backroom.
        </p>
      </section>

      {/* ---- Operator terminal inside the CRT cabinet ---- */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[2.3rem] border-4 border-[#17150f] bg-[#4b4a42] p-4 shadow-[6px_6px_0_#17150f] sm:p-6 sm:shadow-[14px_14px_0_#17150f]">
          <div className="cabinet-stage rounded-[1.7rem] border-4 border-[#17150f] bg-[#f8f1dc] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#17150f] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[var(--cabinet-accent)]">
                OP-00
              </span>
              <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">
                Line open
              </span>
            </div>

            <div className="cabinet-screen relative overflow-hidden rounded-[1.1rem] border-4 border-[#17150f] bg-[#17150f] text-[#f8f1dc]">
              <div className="scanline" />

              {/* Terminal title bar */}
              <div className="relative z-10 flex items-center gap-2 border-b-4 border-[#0d0c08] bg-[#0d0c08]/60 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full bg-[#ff7a93]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#ffb000]/80" />
                  <span className="h-3 w-3 rounded-full bg-[var(--cabinet-accent)]/90" />
                </span>
                <span className="ml-2 truncate font-mono text-xs text-[#f8f1dc]/60">
                  operator@{siteConfig.domain}: ~/booth
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-[#f8f1dc]/55">
                  {stepBadge(api.step, api.status)}
                </span>
              </div>

              {/* Terminal session */}
              <div
                ref={scrollRef}
                className="relative z-10 max-h-[68vh] overflow-y-auto p-5 font-mono text-sm sm:p-6"
              >
                <div className="space-y-1 text-xs text-[#f8f1dc]/70 sm:text-sm">
                  <p>
                    <span className="text-[var(--cabinet-accent)]">$</span> ssh operator@
                    {siteConfig.domain}
                  </p>
                  <p className="text-[#f8f1dc]/55">* host key SHA256:9f2a…c0de — fingerprint accepted</p>
                  <p className="text-[#f8f1dc]/55">* channel secured · welcome to the operator booth</p>
                </div>

                <p className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.02em] text-[#f8f1dc] sm:text-3xl">
                  Leave a transmission
                  <span className="blink ml-1 inline-block h-6 w-2.5 translate-y-0.5 bg-[var(--cabinet-accent)] sm:h-7" aria-hidden />
                </p>
                <p className="mt-2 text-xs text-[#f8f1dc]/60 sm:text-sm">
                  Answer each prompt to page the operator. The booth rings you back on your channel.
                </p>

                <div className="mt-6 space-y-6">
                  <IdentityStep api={api} />
                  <MethodStep api={api} />
                  <MessageStep api={api} />
                  <ResultStep api={api} />
                </div>
              </div>
            </div>

            {/* Direct line fallback */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex min-h-14 items-center justify-between gap-3 rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-3 font-mono text-xs font-bold text-[#f8f1dc] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:text-sm sm:shadow-[5px_5px_0_var(--accent)]"
              >
                <span className="truncate">{siteConfig.email}</span>
                <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 font-display text-[0.65rem] uppercase tracking-[0.16em] text-[#17150f]">
                  Direct line
                </span>
              </a>
              <a
                href="https://ko-fi.com/snoigel"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[var(--accent-deep)] px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:shadow-[5px_5px_0_#17150f]"
              >
                Drop a coin on Ko-fi
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-4 border-[#17150f] bg-[#17150f] px-4 py-6 text-[#f8f1dc]">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] sm:flex-row">
          <span>{siteConfig.name} · operator booth</span>
          <span>Reply channel: {siteConfig.email}</span>
        </div>
      </footer>
    </main>
  );
}

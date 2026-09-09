/*!
 * agent.js — embeddable chat widget (Phase 1 Slice 1K).
 * Vanilla, Shadow DOM, no dependencies. Talks ONLY to the public
 * /api/v1/agent/{publicId}/{session,turn} endpoints with a short-lived scoped
 * session token. Never sees a credential or tool internals.
 *
 *   <script src="https://cdn.example.com/agent.js"></script>
 *   <script>Agent.init({ publicId: "agt_...", apiBase: "https://api.example.com/api/v1" });</script>
 */
(function () {
  "use strict";

  var STYLE = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .launcher { position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px; border-radius: 50%;
      background: #2563eb; color: #fff; border: 0; cursor: pointer; font-size: 24px; box-shadow: 0 8px 24px rgb(0 0 0 / .25); z-index: 999999; }
    .panel { position: fixed; right: 20px; bottom: 88px; width: 360px; max-width: calc(100vw - 40px); height: 520px;
      max-height: calc(100vh - 120px); background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; display: none;
      flex-direction: column; overflow: hidden; box-shadow: 0 16px 48px rgb(0 0 0 / .18); z-index: 999999; }
    .panel.open { display: flex; }
    header { background: #2563eb; color: #fff; padding: 14px 16px; font-weight: 600; }
    .log { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: #f9fafb; }
    .msg { max-width: 85%; padding: 9px 12px; border-radius: 12px; font-size: 14px; line-height: 1.4; white-space: pre-wrap; }
    .msg.user { align-self: flex-end; background: #2563eb; color: #fff; }
    .msg.bot { align-self: flex-start; background: #fff; border: 1px solid #e5e7eb; }
    .cites { align-self: flex-start; font-size: 11px; color: #6b7280; display: flex; gap: 6px; flex-wrap: wrap; }
    .chip { background: #eef2ff; color: #3730a3; border-radius: 999px; padding: 1px 8px; }
    form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #eee; background: #fff; }
    input { flex: 1; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; }
    button.send { border: 0; background: #2563eb; color: #fff; border-radius: 10px; padding: 0 14px; cursor: pointer; }
    button.send:disabled { opacity: .5; }
  `;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var Agent = {
    init: function (opts) {
      opts = opts || {};
      var publicId = opts.publicId;
      var apiBase = (opts.apiBase || "/api/v1").replace(/\/$/, "");
      if (!publicId) throw new Error("Agent.init: publicId is required");

      var host = document.createElement("div");
      host.setAttribute("data-agent-widget", publicId);
      document.body.appendChild(host);
      var root = host.attachShadow({ mode: "open" });
      var style = document.createElement("style");
      style.textContent = STYLE;
      root.appendChild(style);

      var launcher = el("button", "launcher", "\u{1F4AC}");
      launcher.setAttribute("aria-label", "Open chat");
      var panel = el("div", "panel");
      var head = el("header", null, "Assistant");
      var log = el("div", "log");
      log.setAttribute("role", "log");
      log.setAttribute("aria-live", "polite");
      var form = el("form");
      var input = el("input");
      input.type = "text";
      input.placeholder = "Type a message…";
      input.setAttribute("aria-label", "Message");
      var send = el("button", "send", "Send");
      send.type = "submit";
      form.appendChild(input);
      form.appendChild(send);
      panel.appendChild(head);
      panel.appendChild(log);
      panel.appendChild(form);
      root.appendChild(launcher);
      root.appendChild(panel);

      var session = null;

      function addMsg(role, text) {
        var m = el("div", "msg " + (role === "user" ? "user" : "bot"), text);
        log.appendChild(m);
        log.scrollTop = log.scrollHeight;
        return m;
      }
      function addCitations(cites) {
        if (!cites || !cites.length) return;
        var wrap = el("div", "cites");
        cites.slice(0, 4).forEach(function (c, i) {
          wrap.appendChild(el("span", "chip", "[" + (i + 1) + "] " + (c.title || c.url || "source")));
        });
        log.appendChild(wrap);
        log.scrollTop = log.scrollHeight;
      }

      async function ensureSession() {
        if (session) return session;
        var r = await fetch(apiBase + "/agent/" + encodeURIComponent(publicId) + "/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!r.ok) throw new Error("session failed");
        session = (await r.json()).data;
        head.textContent = session.agent_name || "Assistant";
        addMsg("bot", session.greeting);
        return session;
      }

      launcher.addEventListener("click", async function () {
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) {
          input.focus();
          try {
            await ensureSession();
          } catch (e) {
            addMsg("bot", "Sorry, the assistant is unavailable right now.");
          }
        }
      });

      form.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        input.value = "";
        send.disabled = true;
        addMsg("user", text);
        var pending = addMsg("bot", "…");
        try {
          var s = await ensureSession();
          var r = await fetch(apiBase + "/agent/" + encodeURIComponent(publicId) + "/turn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: s.session_token, message: text }),
          });
          var data = (await r.json()).data;
          if (!r.ok || !data) throw new Error("turn failed");
          pending.textContent = data.reply;
          addCitations(data.citations);
        } catch (e) {
          pending.textContent = "Something went wrong. Please try again.";
        } finally {
          send.disabled = false;
          input.focus();
        }
      });
    },
  };

  window.Agent = Agent;
})();

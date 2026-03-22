import * as crypto from "crypto";

export interface ToolDef {
  name: string;
  label: string;
  category: string;
  pro: boolean;
  fields: FieldDef[];
}

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "checkbox";
  options?: string[];
  default?: string;
  required?: boolean;
  placeholder?: string;
}

export const FREE_TOOLS = new Set([
  "uuid", "hash", "base64", "timestamp", "jwt_decode",
  "random_string", "url_encode", "json_format", "regex_test",
  "cron_explain", "hmac", "color_convert", "http_status",
  "slug", "escape_html"
]);

export const TOOL_DEFS: ToolDef[] = [
  // --- FREE ---
  { name: "uuid", label: "UUID Generator", category: "Generate", pro: false, fields: [
    { name: "count", label: "Count", type: "number", default: "1", placeholder: "1-10" }
  ]},
  { name: "hash", label: "Hash", category: "Crypto", pro: false, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "algorithm", label: "Algorithm", type: "select", options: ["sha256", "sha1", "md5"], default: "sha256" }
  ]},
  { name: "base64", label: "Base64", category: "Encode", pro: false, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "action", label: "Action", type: "select", options: ["encode", "decode"], default: "encode" }
  ]},
  { name: "timestamp", label: "Timestamp", category: "Convert", pro: false, fields: [
    { name: "value", label: "Value (empty=now)", type: "text", placeholder: "Unix ts or ISO date" }
  ]},
  { name: "jwt_decode", label: "JWT Decode", category: "Crypto", pro: false, fields: [
    { name: "token", label: "JWT Token", type: "textarea", required: true }
  ]},
  { name: "random_string", label: "Random String", category: "Generate", pro: false, fields: [
    { name: "length", label: "Length", type: "number", default: "16" },
    { name: "charset", label: "Charset", type: "select", options: ["alphanumeric", "alpha", "numeric", "hex", "password", "url-safe"], default: "alphanumeric" }
  ]},
  { name: "url_encode", label: "URL Encode/Decode", category: "Encode", pro: false, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "action", label: "Action", type: "select", options: ["encode", "decode"], default: "encode" }
  ]},
  { name: "json_format", label: "JSON Format", category: "Format", pro: false, fields: [
    { name: "json", label: "JSON", type: "textarea", required: true },
    { name: "action", label: "Action", type: "select", options: ["format", "minify"], default: "format" },
    { name: "indent", label: "Indent", type: "number", default: "2" }
  ]},
  { name: "regex_test", label: "Regex Test", category: "Text", pro: false, fields: [
    { name: "pattern", label: "Pattern", type: "text", required: true },
    { name: "text", label: "Test String", type: "textarea", required: true },
    { name: "flags", label: "Flags", type: "text", default: "g", placeholder: "g, gi, etc." }
  ]},
  { name: "cron_explain", label: "Cron Explain", category: "Convert", pro: false, fields: [
    { name: "expression", label: "Cron Expression", type: "text", required: true, placeholder: "*/5 * * * *" }
  ]},
  { name: "hmac", label: "HMAC", category: "Crypto", pro: false, fields: [
    { name: "message", label: "Message", type: "textarea", required: true },
    { name: "key", label: "Key", type: "text", required: true },
    { name: "algorithm", label: "Algorithm", type: "select", options: ["sha256", "sha512", "sha1", "md5"], default: "sha256" },
    { name: "encoding", label: "Encoding", type: "select", options: ["hex", "base64"], default: "hex" }
  ]},
  { name: "color_convert", label: "Color Convert", category: "Convert", pro: false, fields: [
    { name: "color", label: "Color", type: "text", required: true, placeholder: "#ff5733 or rgb(255,87,51)" }
  ]},
  { name: "http_status", label: "HTTP Status", category: "Reference", pro: false, fields: [
    { name: "code", label: "Status Code", type: "number", required: true, placeholder: "200" }
  ]},
  { name: "slug", label: "Slugify", category: "Text", pro: false, fields: [
    { name: "text", label: "Text", type: "text", required: true },
    { name: "separator", label: "Separator", type: "text", default: "-" }
  ]},
  { name: "escape_html", label: "HTML Escape", category: "Encode", pro: false, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "action", label: "Action", type: "select", options: ["escape", "unescape"], default: "escape" }
  ]},
  // --- PRO ---
  { name: "semver_compare", label: "Semver Compare", category: "Compare", pro: true, fields: [
    { name: "version1", label: "Version 1", type: "text", required: true, placeholder: "1.2.3" },
    { name: "version2", label: "Version 2", type: "text", required: true, placeholder: "1.3.0" }
  ]},
  { name: "chmod_calc", label: "Chmod Calculator", category: "Convert", pro: true, fields: [
    { name: "permission", label: "Permission", type: "text", required: true, placeholder: "755 or rwxr-xr-x" }
  ]},
  { name: "diff", label: "Text Diff", category: "Compare", pro: true, fields: [
    { name: "text1", label: "Text 1", type: "textarea", required: true },
    { name: "text2", label: "Text 2", type: "textarea", required: true }
  ]},
  { name: "number_base", label: "Number Base", category: "Convert", pro: true, fields: [
    { name: "value", label: "Value", type: "text", required: true, placeholder: "255 or 0xFF or 0b1111" }
  ]},
  { name: "lorem_ipsum", label: "Lorem Ipsum", category: "Generate", pro: true, fields: [
    { name: "count", label: "Count", type: "number", default: "1" },
    { name: "unit", label: "Unit", type: "select", options: ["paragraphs", "sentences", "words"], default: "paragraphs" }
  ]},
  { name: "word_count", label: "Word Count", category: "Text", pro: true, fields: [
    { name: "text", label: "Text", type: "textarea", required: true }
  ]},
  { name: "cidr", label: "CIDR Calculator", category: "Network", pro: true, fields: [
    { name: "notation", label: "CIDR Notation", type: "text", required: true, placeholder: "192.168.1.0/24" }
  ]},
  { name: "case_convert", label: "Case Convert", category: "Text", pro: true, fields: [
    { name: "text", label: "Text", type: "text", required: true },
    { name: "to", label: "To", type: "select", options: ["camel", "pascal", "snake", "kebab", "constant", "title"], default: "camel" }
  ]},
  { name: "markdown_toc", label: "Markdown TOC", category: "Format", pro: true, fields: [
    { name: "markdown", label: "Markdown", type: "textarea", required: true },
    { name: "max_depth", label: "Max Depth", type: "number", default: "3" }
  ]},
  { name: "env_parse", label: "Env Parser", category: "Format", pro: true, fields: [
    { name: "content", label: ".env Content", type: "textarea", required: true }
  ]},
  { name: "ip_info", label: "IP Info", category: "Network", pro: true, fields: [
    { name: "ip", label: "IP Address", type: "text", required: true, placeholder: "192.168.1.1" }
  ]},
  { name: "password_strength", label: "Password Strength", category: "Crypto", pro: true, fields: [
    { name: "password", label: "Password", type: "text", required: true }
  ]},
  { name: "data_size", label: "Data Size", category: "Convert", pro: true, fields: [
    { name: "value", label: "Value", type: "number", required: true },
    { name: "unit", label: "Unit", type: "select", options: ["B", "KB", "MB", "GB", "TB", "PB", "KiB", "MiB", "GiB", "TiB", "PiB"], default: "B" }
  ]},
  { name: "string_escape", label: "String Escape", category: "Encode", pro: true, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "format", label: "Format", type: "select", options: ["json", "csv", "regex", "sql", "shell"], default: "json" },
    { name: "action", label: "Action", type: "select", options: ["escape", "unescape"], default: "escape" }
  ]},
  { name: "nanoid", label: "NanoID", category: "Generate", pro: true, fields: [
    { name: "length", label: "Length", type: "number", default: "21" },
    { name: "count", label: "Count", type: "number", default: "1" }
  ]},
  { name: "csv_json", label: "CSV/JSON Convert", category: "Convert", pro: true, fields: [
    { name: "input", label: "Input", type: "textarea", required: true },
    { name: "direction", label: "Direction", type: "select", options: ["csv_to_json", "json_to_csv"], default: "csv_to_json" },
    { name: "delimiter", label: "Delimiter", type: "text", default: "," }
  ]},
  { name: "hex_encode", label: "Hex Encode", category: "Encode", pro: true, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "action", label: "Action", type: "select", options: ["encode", "decode"], default: "encode" }
  ]},
  { name: "char_info", label: "Char Info", category: "Text", pro: true, fields: [
    { name: "text", label: "Characters", type: "text", required: true, placeholder: "1-20 chars" }
  ]},
  { name: "byte_count", label: "Byte Count", category: "Text", pro: true, fields: [
    { name: "text", label: "Text", type: "textarea", required: true }
  ]},
  { name: "json_diff", label: "JSON Diff", category: "Compare", pro: true, fields: [
    { name: "a", label: "JSON A", type: "textarea", required: true },
    { name: "b", label: "JSON B", type: "textarea", required: true }
  ]},
  { name: "jwt_create", label: "JWT Create", category: "Crypto", pro: true, fields: [
    { name: "payload", label: "Payload (JSON)", type: "textarea", required: true, placeholder: '{"sub":"1234","name":"Test"}' },
    { name: "secret", label: "Secret", type: "text", default: "secret" },
    { name: "expiresIn", label: "Expires In (sec)", type: "number", default: "3600" }
  ]},
  { name: "sql_format", label: "SQL Format", category: "Format", pro: true, fields: [
    { name: "sql", label: "SQL Query", type: "textarea", required: true },
    { name: "uppercase", label: "Uppercase Keywords", type: "checkbox", default: "true" }
  ]},
  { name: "json_query", label: "JSON Query", category: "Format", pro: true, fields: [
    { name: "json", label: "JSON", type: "textarea", required: true },
    { name: "path", label: "Path", type: "text", required: true, placeholder: "user.name or items[0].id" }
  ]},
  { name: "epoch_convert", label: "Epoch Convert", category: "Convert", pro: true, fields: [
    { name: "value", label: "Value (empty=now)", type: "text", placeholder: "Unix ts or ISO date" },
    { name: "timezone", label: "Extra Timezone", type: "text", placeholder: "Asia/Tokyo" }
  ]},
  { name: "aes_encrypt", label: "AES Encrypt", category: "Crypto", pro: true, fields: [
    { name: "text", label: "Plaintext", type: "textarea", required: true },
    { name: "key", label: "Key", type: "text", required: true }
  ]},
  { name: "aes_decrypt", label: "AES Decrypt", category: "Crypto", pro: true, fields: [
    { name: "encrypted", label: "Encrypted (hex)", type: "textarea", required: true },
    { name: "key", label: "Key", type: "text", required: true }
  ]},
  { name: "rsa_keygen", label: "RSA Keygen", category: "Crypto", pro: true, fields: [
    { name: "bits", label: "Bits", type: "select", options: ["2048", "1024", "4096"], default: "2048" }
  ]},
  { name: "scrypt_hash", label: "Scrypt Hash", category: "Crypto", pro: true, fields: [
    { name: "password", label: "Password", type: "text", required: true },
    { name: "salt", label: "Salt (hex, optional)", type: "text" }
  ]},
  { name: "regex_replace", label: "Regex Replace", category: "Text", pro: true, fields: [
    { name: "text", label: "Text", type: "textarea", required: true },
    { name: "pattern", label: "Pattern", type: "text", required: true },
    { name: "replacement", label: "Replacement", type: "text", required: true },
    { name: "flags", label: "Flags", type: "text", default: "g" }
  ]}
];

// --- Tool execution engine ---
export function executeTool(name: string, args: Record<string, string>): string {
  switch (name) {
    case "uuid": {
      const count = Math.min(Math.max(1, parseInt(args.count) || 1), 10);
      return Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
    }
    case "hash": {
      const alg = args.algorithm || "sha256";
      return `${alg}: ${crypto.createHash(alg).update(args.text, "utf8").digest("hex")}`;
    }
    case "base64": {
      if (args.action === "decode") {
        return Buffer.from(args.text, "base64").toString("utf8");
      }
      return Buffer.from(args.text, "utf8").toString("base64");
    }
    case "timestamp": {
      const v = args.value?.trim();
      if (!v) {
        const now = new Date();
        return `Unix: ${Math.floor(now.getTime() / 1000)}\nISO: ${now.toISOString()}\nUTC: ${now.toUTCString()}`;
      }
      if (/^\d+(\.\d+)?$/.test(v)) {
        const unix = parseFloat(v);
        const ms = unix > 1e10 ? unix : unix * 1000;
        const d = new Date(ms);
        return `Unix: ${Math.floor(unix)}\nISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}`;
      }
      const d = new Date(v);
      if (isNaN(d.getTime())) { throw new Error(`Invalid date: ${v}`); }
      return `ISO: ${d.toISOString()}\nUnix: ${Math.floor(d.getTime() / 1000)}\nUTC: ${d.toUTCString()}`;
    }
    case "jwt_decode": {
      const parts = args.token.trim().split(".");
      if (parts.length !== 3) { throw new Error("Invalid JWT: must have 3 dot-separated parts"); }
      const dec = (s: string) => {
        const p = s + "=".repeat((4 - (s.length % 4)) % 4);
        return Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
      };
      const header = JSON.parse(dec(parts[0]));
      const payload = JSON.parse(dec(parts[1]));
      const result: any = { header, payload, signature: parts[2], note: "Signature NOT verified" };
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        result.expires = expDate.toISOString();
        result.expired = expDate < new Date();
      }
      if (payload.iat) { result.issued_at = new Date(payload.iat * 1000).toISOString(); }
      return JSON.stringify(result, null, 2);
    }
    case "random_string": {
      const len = Math.min(Math.max(1, parseInt(args.length) || 16), 256);
      const charsets: Record<string, string> = {
        alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        numeric: "0123456789",
        hex: "0123456789abcdef",
        password: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?",
        "url-safe": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
      };
      const chars = charsets[args.charset] || charsets.alphanumeric;
      const bytes = crypto.randomBytes(len);
      let result = "";
      for (let i = 0; i < len; i++) { result += chars[bytes[i] % chars.length]; }
      return result;
    }
    case "url_encode": {
      return args.action === "decode" ? decodeURIComponent(args.text) : encodeURIComponent(args.text);
    }
    case "json_format": {
      const parsed = JSON.parse(args.json);
      if (args.action === "minify") { return JSON.stringify(parsed); }
      return JSON.stringify(parsed, null, Math.min(Math.max(0, parseInt(args.indent) || 2), 8));
    }
    case "regex_test": {
      const flags = args.flags || "";
      const regex = new RegExp(args.pattern, flags);
      const matches: any[] = [];
      let match;
      if (flags.includes("g")) {
        while ((match = regex.exec(args.text)) !== null) {
          matches.push({ match: match[0], index: match.index });
          if (match.index === regex.lastIndex) { regex.lastIndex++; }
        }
      } else {
        match = regex.exec(args.text);
        if (match) { matches.push({ match: match[0], index: match.index, captures: match.slice(1) }); }
      }
      return JSON.stringify({ pattern: args.pattern, flags: flags || "(none)", matched: matches.length > 0, count: matches.length, matches }, null, 2);
    }
    case "cron_explain": {
      const parts = args.expression.trim().split(/\s+/);
      if (parts.length !== 5) { throw new Error("Cron must have 5 fields: min hour day month weekday"); }
      const [minute, hour, day, month, weekday] = parts;
      const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const desc = (val: string, f: string) => {
        if (val === "*") { return `every ${f}`; }
        if (val.includes("/")) { const [b, s] = val.split("/"); return b === "*" ? `every ${s} ${f}s` : `every ${s} ${f}s from ${b}`; }
        if (val.includes(",")) { return `${f}s ${val}`; }
        if (val.includes("-")) { return `${f}s ${val.split("-")[0]}-${val.split("-")[1]}`; }
        return `${f} ${val}`;
      };
      const lines = [
        `Expression: ${args.expression}`, "",
        `Minute: ${desc(minute, "minute")}`,
        `Hour: ${desc(hour, "hour")}`,
        `Day: ${desc(day, "day")}`,
        `Month: ${desc(month, "month")}`,
        `Weekday: ${weekday === "*" ? "every day" : weekday.split(",").map(w => WEEKDAYS[parseInt(w)] || w).join(", ")}`
      ];
      return lines.join("\n");
    }
    case "hmac": {
      const alg = args.algorithm || "sha256";
      const enc = args.encoding || "hex";
      const h = crypto.createHmac(alg, args.key).update(args.message, "utf8").digest(enc as any);
      return `HMAC-${alg.toUpperCase()} (${enc}): ${h}`;
    }
    case "color_convert": {
      let r: number, g: number, b: number;
      const c = args.color;
      const hexM = c.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
      const rgbM = c.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
      if (hexM) {
        let hex = hexM[1];
        if (hex.length === 3) { hex = hex.split("").map(x => x + x).join(""); }
        r = parseInt(hex.slice(0, 2), 16); g = parseInt(hex.slice(2, 4), 16); b = parseInt(hex.slice(4, 6), 16);
      } else if (rgbM) {
        r = parseInt(rgbM[1]); g = parseInt(rgbM[2]); b = parseInt(rgbM[3]);
      } else { throw new Error("Use hex (#ff5733) or rgb(255,87,51)"); }
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rn) { h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; }
        else if (max === gn) { h = ((bn - rn) / d + 2) / 6; }
        else { h = ((rn - gn) / d + 4) / 6; }
      }
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      return `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    case "http_status": {
      const statuses: Record<number, [string, string, string]> = {
        100: ["Continue", "Informational", "Server received headers, proceed with body."],
        101: ["Switching Protocols", "Informational", "Server switching protocols (e.g. WebSocket)."],
        200: ["OK", "Success", "Standard success response."],
        201: ["Created", "Success", "New resource created."],
        204: ["No Content", "Success", "Success, no body."],
        301: ["Moved Permanently", "Redirection", "Resource permanently moved."],
        302: ["Found", "Redirection", "Resource temporarily at different URL."],
        304: ["Not Modified", "Redirection", "Resource not modified (caching)."],
        400: ["Bad Request", "Client Error", "Malformed syntax or invalid parameters."],
        401: ["Unauthorized", "Client Error", "Authentication required."],
        403: ["Forbidden", "Client Error", "Server refuses to authorize."],
        404: ["Not Found", "Client Error", "Resource not found."],
        405: ["Method Not Allowed", "Client Error", "HTTP method not allowed."],
        409: ["Conflict", "Client Error", "Request conflicts with current state."],
        422: ["Unprocessable Entity", "Client Error", "Well-formed but semantically invalid."],
        429: ["Too Many Requests", "Client Error", "Rate limited."],
        500: ["Internal Server Error", "Server Error", "Unexpected server condition."],
        502: ["Bad Gateway", "Server Error", "Invalid upstream response."],
        503: ["Service Unavailable", "Server Error", "Server temporarily unable."],
        504: ["Gateway Timeout", "Server Error", "Upstream timeout."]
      };
      const code = parseInt(args.code);
      const info = statuses[code];
      if (!info) { return `${code}: Unknown status code`; }
      return `${code} ${info[0]}\nCategory: ${info[1]}\n${info[2]}`;
    }
    case "slug": {
      const sep = args.separator || "-";
      return args.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, sep);
    }
    case "escape_html": {
      if (args.action === "unescape") {
        return args.text.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
      }
      return args.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    // --- PRO TOOLS ---
    case "semver_compare": {
      const parse = (v: string) => {
        const m = v.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
        if (!m) { throw new Error(`Invalid semver: ${v}`); }
        return { major: parseInt(m[1]), minor: parseInt(m[2]), patch: parseInt(m[3]), pre: m[4] || null };
      };
      const v1 = parse(args.version1), v2 = parse(args.version2);
      const cmp = v1.major !== v2.major ? v1.major - v2.major : v1.minor !== v2.minor ? v1.minor - v2.minor : v1.patch - v2.patch;
      const sym = cmp < 0 ? "<" : cmp > 0 ? ">" : "=";
      return `${args.version1} ${sym} ${args.version2}`;
    }
    case "chmod_calc": {
      const p = args.permission;
      if (/^[0-7]{3,4}$/.test(p)) {
        const d = p.length === 4 ? p : "0" + p;
        const o = parseInt(d[1]), g = parseInt(d[2]), t = parseInt(d[3]);
        const rwx = (n: number) => ["---","--x","-w-","-wx","r--","r-x","rw-","rwx"][n];
        return `Numeric: ${p}\nSymbolic: ${rwx(o)}${rwx(g)}${rwx(t)}\nOwner: ${rwx(o)} (${o})\nGroup: ${rwx(g)} (${g})\nOther: ${rwx(t)} (${t})`;
      }
      throw new Error("Use numeric (755) or symbolic (rwxr-xr-x)");
    }
    case "diff": {
      const l1 = args.text1.split("\n"), l2 = args.text2.split("\n");
      const out: string[] = [];
      let added = 0, removed = 0, same = 0;
      const max = Math.max(l1.length, l2.length);
      for (let i = 0; i < max; i++) {
        const a = i < l1.length ? l1[i] : undefined;
        const b = i < l2.length ? l2[i] : undefined;
        if (a === b) { out.push(`  ${a}`); same++; }
        else { if (a !== undefined) { out.push(`- ${a}`); removed++; } if (b !== undefined) { out.push(`+ ${b}`); added++; } }
      }
      return out.join("\n") + `\n\n+${added} -${removed} =${same}`;
    }
    case "number_base": {
      const v = args.value.trim();
      let num: number;
      if (v.startsWith("0x") || v.startsWith("0X")) { num = parseInt(v, 16); }
      else if (v.startsWith("0o") || v.startsWith("0O")) { num = parseInt(v.slice(2), 8); }
      else if (v.startsWith("0b") || v.startsWith("0B")) { num = parseInt(v.slice(2), 2); }
      else { num = parseInt(v, 10); }
      if (isNaN(num)) { throw new Error(`Invalid number: ${args.value}`); }
      return `Decimal:     ${num}\nHexadecimal: 0x${num.toString(16).toUpperCase()}\nOctal:       0o${num.toString(8)}\nBinary:      0b${num.toString(2)}`;
    }
    case "lorem_ipsum": {
      const sentences = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
      ];
      const n = Math.min(Math.max(1, parseInt(args.count) || 1), 20);
      const unit = args.unit || "paragraphs";
      if (unit === "words") { return sentences.join(" ").split(/\s+/).slice(0, n).join(" "); }
      if (unit === "sentences") { return Array.from({ length: n }, (_, i) => sentences[i % sentences.length]).join(" "); }
      return Array.from({ length: n }, (_, i) => { const s = (i * 3) % sentences.length; return Array.from({ length: 5 }, (__, j) => sentences[(s + j) % sentences.length]).join(" "); }).join("\n\n");
    }
    case "word_count": {
      const t = args.text;
      return `Characters: ${t.length}\nWords: ${t.trim() === "" ? 0 : t.trim().split(/\s+/).length}\nLines: ${t.split("\n").length}\nBytes (UTF-8): ${Buffer.byteLength(t, "utf8")}`;
    }
    case "cidr": {
      const m = args.notation.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
      if (!m) { throw new Error("Use format: 192.168.1.0/24"); }
      const octets = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4])];
      const prefix = parseInt(m[5]);
      const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
      const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
      const network = (ip & mask) >>> 0;
      const broadcast = (network | ~mask) >>> 0;
      const toIP = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;
      const hostCount = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
      return `CIDR: ${args.notation}\nNetwork: ${toIP(network)}\nNetmask: ${toIP(mask)}\nBroadcast: ${toIP(broadcast)}\nHosts: ${hostCount}\nPrefix: /${prefix}`;
    }
    case "case_convert": {
      const words = args.text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").split(/\s+/).filter(w => w.length > 0).map(w => w.toLowerCase());
      const converters: Record<string, () => string> = {
        camel: () => words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join(""),
        pascal: () => words.map(w => w[0].toUpperCase() + w.slice(1)).join(""),
        snake: () => words.join("_"),
        kebab: () => words.join("-"),
        constant: () => words.map(w => w.toUpperCase()).join("_"),
        title: () => words.map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
      };
      if (!converters[args.to]) { throw new Error(`Unknown case: ${args.to}`); }
      return converters[args.to]();
    }
    case "markdown_toc": {
      const maxDepth = parseInt(args.max_depth) || 3;
      const toc: string[] = [];
      for (const line of args.markdown.split("\n")) {
        const m = line.match(/^(#{1,6})\s+(.+)$/);
        if (m && m[1].length <= maxDepth) {
          const text = m[2].replace(/[*_`\[\]]/g, "").trim();
          const anchor = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
          toc.push(`${"  ".repeat(m[1].length - 1)}- [${text}](#${anchor})`);
        }
      }
      return toc.length > 0 ? toc.join("\n") : "No headings found.";
    }
    case "env_parse": {
      const lines = args.content.split("\n");
      const keys: string[] = [];
      const issues: string[] = [];
      const seen = new Set<string>();
      lines.forEach((line, i) => {
        const t = line.trim();
        if (!t || t.startsWith("#")) { return; }
        const eq = t.indexOf("=");
        if (eq === -1) { issues.push(`Line ${i + 1}: No '=' found`); return; }
        const key = t.substring(0, eq).trim();
        const val = t.substring(eq + 1).trim();
        if (seen.has(key)) { issues.push(`Line ${i + 1}: Duplicate '${key}'`); }
        if (!val) { issues.push(`Line ${i + 1}: Empty value for '${key}'`); }
        seen.add(key);
        keys.push(`${key} = ${val.length > 50 ? val.substring(0, 50) + "..." : val}`);
      });
      let out = `Parsed ${keys.length} key(s)\n`;
      if (keys.length) { out += "\n" + keys.join("\n"); }
      if (issues.length) { out += `\n\nIssues (${issues.length}):\n` + issues.join("\n"); }
      return out;
    }
    case "ip_info": {
      const ip = args.ip.trim();
      if (ip.includes(":")) {
        let type = "Global unicast (public)";
        if (ip === "::1") { type = "Loopback"; }
        else if (ip.startsWith("fe80:")) { type = "Link-local"; }
        else if (ip.startsWith("fc") || ip.startsWith("fd")) { type = "Unique local (private)"; }
        return `IP: ${ip}\nVersion: IPv6\nType: ${type}`;
      }
      const parts = ip.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) { throw new Error(`Invalid IPv4: ${ip}`); }
      let type = "Public";
      if (parts[0] === 127) { type = "Loopback"; }
      else if (parts[0] === 10) { type = "Private (10.0.0.0/8)"; }
      else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) { type = "Private (172.16.0.0/12)"; }
      else if (parts[0] === 192 && parts[1] === 168) { type = "Private (192.168.0.0/16)"; }
      return `IP: ${ip}\nVersion: IPv4\nType: ${type}\nBinary: ${parts.map(o => o.toString(2).padStart(8, "0")).join(".")}`;
    }
    case "password_strength": {
      const pw = args.password;
      let cs = 0;
      if (/[a-z]/.test(pw)) { cs += 26; }
      if (/[A-Z]/.test(pw)) { cs += 26; }
      if (/[0-9]/.test(pw)) { cs += 10; }
      if (/[^a-zA-Z0-9]/.test(pw)) { cs += 32; }
      const entropy = Math.round(pw.length * Math.log2(cs || 1) * 100) / 100;
      let strength = entropy < 28 ? "Very Weak" : entropy < 36 ? "Weak" : entropy < 60 ? "Moderate" : entropy < 80 ? "Strong" : "Very Strong";
      return `Length: ${pw.length}\nCharset: ${cs}\nEntropy: ${entropy} bits\nStrength: ${strength}`;
    }
    case "data_size": {
      const units: Record<string, number> = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15, KiB: 1024, MiB: 1048576, GiB: 1073741824, TiB: 1099511627776, PiB: 1125899906842624 };
      const u = args.unit || "B";
      if (!units[u]) { throw new Error(`Unknown unit: ${u}`); }
      const bytes = parseFloat(args.value) * units[u];
      const f = (n: number) => n < 0.01 ? n.toExponential(2) : (n % 1 === 0 ? n.toString() : n.toFixed(2));
      return `${args.value} ${u} =\n\nSI: ${f(bytes / 1e3)} KB | ${f(bytes / 1e6)} MB | ${f(bytes / 1e9)} GB\nIEC: ${f(bytes / 1024)} KiB | ${f(bytes / 1048576)} MiB | ${f(bytes / 1073741824)} GiB`;
    }
    case "string_escape": {
      const { text, format, action = "escape" } = args;
      if (action === "escape") {
        switch (format) {
          case "json": return JSON.stringify(text).slice(1, -1);
          case "csv": return text.includes(",") || text.includes('"') || text.includes("\n") ? '"' + text.replace(/"/g, '""') + '"' : text;
          case "regex": return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          case "sql": return text.replace(/'/g, "''");
          case "shell": return "'" + text.replace(/'/g, "'\\''") + "'";
          default: throw new Error(`Unknown format: ${format}`);
        }
      }
      switch (format) {
        case "json": return JSON.parse(`"${text}"`);
        case "csv": return text.startsWith('"') && text.endsWith('"') ? text.slice(1, -1).replace(/""/g, '"') : text;
        case "regex": return text.replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
        case "sql": return text.replace(/''/g, "'");
        case "shell": return text.startsWith("'") && text.endsWith("'") ? text.slice(1, -1).replace(/'\\''/g, "'") : text;
        default: throw new Error(`Unknown format: ${format}`);
      }
    }
    case "nanoid": {
      const len = Math.min(Math.max(parseInt(args.length) || 21, 1), 128);
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
      const count = Math.min(Math.max(parseInt(args.count) || 1, 1), 10);
      const ids: string[] = [];
      for (let c = 0; c < count; c++) {
        const bytes = crypto.randomBytes(len);
        let id = "";
        for (let j = 0; j < len; j++) { id += alphabet[bytes[j] % alphabet.length]; }
        ids.push(id);
      }
      return ids.join("\n");
    }
    case "csv_json": {
      if (args.direction === "csv_to_json") {
        const lines = args.input.split("\n").filter(l => l.trim());
        const headers = lines[0].split(args.delimiter || ",").map(h => h.trim().replace(/^"|"$/g, ""));
        const rows = lines.slice(1).map(line => {
          const vals = line.split(args.delimiter || ",").map(v => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
          return obj;
        });
        return JSON.stringify(rows, null, 2);
      }
      const arr = JSON.parse(args.input);
      const headers = Object.keys(arr[0]);
      const del = args.delimiter || ",";
      return [headers.join(del), ...arr.map((r: any) => headers.map(h => String(r[h] ?? "")).join(del))].join("\n");
    }
    case "hex_encode": {
      if (args.action === "decode") { return Buffer.from(args.text.replace(/\s/g, ""), "hex").toString("utf-8"); }
      return Buffer.from(args.text, "utf-8").toString("hex");
    }
    case "char_info": {
      return [...args.text].slice(0, 20).map(ch => {
        const cp = ch.codePointAt(0)!;
        const hex = cp.toString(16).toUpperCase().padStart(4, "0");
        return `'${ch}'  U+${hex}  decimal: ${cp}  HTML: &#x${hex};`;
      }).join("\n");
    }
    case "byte_count": {
      const t = args.text;
      const utf16 = Buffer.from(t, "utf16le").length;
      return `Characters: ${[...t].length}\nUTF-8: ${Buffer.byteLength(t, "utf-8")} bytes\nUTF-16: ${utf16} bytes`;
    }
    case "json_diff": {
      const objA = JSON.parse(args.a), objB = JSON.parse(args.b);
      const diffs: any[] = [];
      const diffObj = (a: any, b: any, prefix = "") => {
        const allKeys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
        for (const key of allKeys) {
          const path = prefix ? `${prefix}.${key}` : key;
          if (!(key in (a || {}))) { diffs.push({ path, type: "added", value: b[key] }); }
          else if (!(key in (b || {}))) { diffs.push({ path, type: "removed", value: a[key] }); }
          else if (typeof a[key] === "object" && typeof b[key] === "object" && a[key] && b[key] && !Array.isArray(a[key])) { diffObj(a[key], b[key], path); }
          else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) { diffs.push({ path, type: "changed", from: a[key], to: b[key] }); }
        }
      };
      diffObj(objA, objB);
      return diffs.length === 0 ? "No differences." : JSON.stringify(diffs, null, 2);
    }
    case "jwt_create": {
      const payload = JSON.parse(args.payload);
      const secret = args.secret || "secret";
      const exp = parseInt(args.expiresIn) || 3600;
      const now = Math.floor(Date.now() / 1000);
      payload.iat = payload.iat || now;
      payload.exp = payload.exp || now + exp;
      const header = { alg: "HS256", typ: "JWT" };
      const b64url = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
      const h = b64url(header), p = b64url(payload);
      const sig = crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
      return `${h}.${p}.${sig}\n\nExpires: ${new Date(payload.exp * 1000).toISOString()}`;
    }
    case "sql_format": {
      let f = args.sql.replace(/\s+/g, " ").trim();
      const upper = args.uppercase !== "false";
      const nl = ["SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "VALUES", "SET", "CREATE TABLE"];
      for (const kw of nl) {
        const r = new RegExp(`\\b${kw}\\b`, "gi");
        f = f.replace(r, `\n${upper ? kw : kw.toLowerCase()}`);
      }
      for (const kw of ["AND", "OR"]) {
        f = f.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n  ${upper ? kw : kw.toLowerCase()}`);
      }
      return f.trim();
    }
    case "json_query": {
      const obj = JSON.parse(args.json);
      const parts = args.path.replace(/\[(\d+)\]/g, ".$1").replace(/\[\*\]/g, ".*").split(".");
      const resolve = (cur: any, p: string[]): any => {
        if (p.length === 0) { return cur; }
        const [head, ...rest] = p;
        if (head === "*" && Array.isArray(cur)) { return cur.map(item => resolve(item, rest)); }
        if (cur == null) { return undefined; }
        return resolve(Array.isArray(cur) ? cur[parseInt(head)] : cur[head], rest);
      };
      const result = resolve(obj, parts);
      return result === undefined ? "undefined (path not found)" : JSON.stringify(result, null, 2);
    }
    case "epoch_convert": {
      const v = args.value?.trim();
      let date: Date;
      if (!v) { date = new Date(); }
      else if (/^\d+$/.test(v)) { const n = parseInt(v); date = new Date(n > 1e12 ? n : n * 1000); }
      else { date = new Date(v); }
      if (isNaN(date.getTime())) { throw new Error(`Invalid: ${v}`); }
      const zones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Singapore"];
      if (args.timezone && !zones.includes(args.timezone)) { zones.push(args.timezone); }
      const lines = [`Epoch (s): ${Math.floor(date.getTime() / 1000)}`, `Epoch (ms): ${date.getTime()}`, `ISO: ${date.toISOString()}`, ""];
      for (const tz of zones) {
        try { lines.push(`${tz}: ${date.toLocaleString("en-US", { timeZone: tz })}`); }
        catch { lines.push(`${tz}: (unsupported)`); }
      }
      return lines.join("\n");
    }
    case "aes_encrypt": {
      const keyHash = crypto.createHash("sha256").update(args.key).digest();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", keyHash, iv);
      let encrypted = cipher.update(args.text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return `Encrypted: ${iv.toString("hex")}${encrypted}\n\nIV: ${iv.toString("hex")}\nCiphertext: ${encrypted}`;
    }
    case "aes_decrypt": {
      const keyHash = crypto.createHash("sha256").update(args.key).digest();
      const enc = args.encrypted;
      if (enc.length < 34) { throw new Error("Too short — need 32-char IV + ciphertext"); }
      const iv = Buffer.from(enc.slice(0, 32), "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", keyHash, iv);
      let dec = decipher.update(enc.slice(32), "hex", "utf8");
      dec += decipher.final("utf8");
      return dec;
    }
    case "rsa_keygen": {
      const bits = [1024, 2048, 4096].includes(parseInt(args.bits)) ? parseInt(args.bits) : 2048;
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: bits,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
      });
      return `=== RSA ${bits}-bit ===\n\n${publicKey}\n${privateKey}`;
    }
    case "scrypt_hash": {
      const salt = args.salt ? Buffer.from(args.salt, "hex") : crypto.randomBytes(16);
      const derived = crypto.scryptSync(args.password, salt, 64);
      return `Salt: ${salt.toString("hex")}\nHash: ${derived.toString("hex")}\nCombined: ${salt.toString("hex")}:${derived.toString("hex")}`;
    }
    case "regex_replace": {
      const flags = args.flags || "g";
      const regex = new RegExp(args.pattern, flags);
      const result = args.text.replace(regex, args.replacement);
      const matchCount = (args.text.match(regex) || []).length;
      return `Matches: ${matchCount}\n\n${result}`;
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

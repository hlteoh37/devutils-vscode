import * as vscode from "vscode";
import * as crypto from "crypto";
import { TOOL_DEFS, FREE_TOOLS, executeTool } from "./tools";

// Ed25519 public key for license verification (private key held server-side)
const LICENSE_PUB_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEActYbi5xXGsEho83iwLy919ciKrEB7uYCm5Bmh5VUFCI=
-----END PUBLIC KEY-----`;

function isProUnlocked(): boolean {
  const key = vscode.workspace.getConfiguration("devutils").get<string>("licenseKey", "");
  if (!key) return false;
  // License format: DU.<payload>.<signature_base64url>
  // Payload = hex(sha256(email))[0:8]
  // Signature = Ed25519 sign(payload) with private key, base64url encoded
  const parts = key.split(".");
  if (parts.length !== 3 || parts[0] !== "DU") return false;
  const [, payload, sigB64] = parts;
  try {
    const sig = Buffer.from(sigB64.replace(/_/g, "/").replace(/-/g, "+"), "base64");
    const pubKey = crypto.createPublicKey(LICENSE_PUB_KEY);
    return crypto.verify(null, Buffer.from(payload), pubKey, sig);
  } catch {
    return false;
  }
}

const PRO_UPGRADE_MSG = "This is a Pro tool. Enter a license key in Settings > DevUtils to unlock 29 Pro tools. Get a license at https://buymeacoffee.com/gl89tu25lp";

export function activate(context: vscode.ExtensionContext) {
  // Register sidebar webview
  const provider = new DevUtilsViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("devutils.toolPanel", provider)
  );

  // Open panel command
  context.subscriptions.push(
    vscode.commands.registerCommand("devutils.openPanel", () => {
      vscode.commands.executeCommand("devutils.toolPanel.focus");
    })
  );

  // Quick commands that use selected text
  const quickCommands: Record<string, (text: string) => string> = {
    "devutils.uuid": () => executeTool("uuid", { count: "1" }),
    "devutils.hash": (t) => executeTool("hash", { text: t, algorithm: "sha256" }),
    "devutils.base64Encode": (t) => executeTool("base64", { text: t, action: "encode" }),
    "devutils.base64Decode": (t) => executeTool("base64", { text: t, action: "decode" }),
    "devutils.timestamp": (t) => executeTool("timestamp", { value: t }),
    "devutils.jwtDecode": (t) => executeTool("jwt_decode", { token: t }),
    "devutils.urlEncode": (t) => executeTool("url_encode", { text: t, action: "encode" }),
    "devutils.jsonFormat": (t) => executeTool("json_format", { json: t, action: "format", indent: "2" }),
    "devutils.jsonMinify": (t) => executeTool("json_format", { json: t, action: "minify", indent: "0" }),
  };

  for (const [cmd, fn] of Object.entries(quickCommands)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(cmd, () => {
        const editor = vscode.window.activeTextEditor;
        const text = editor?.document.getText(editor.selection) || "";
        try {
          const result = fn(text);
          // If there's a selection, offer to replace it; otherwise show in output
          if (editor && !editor.selection.isEmpty) {
            editor.edit(editBuilder => {
              editBuilder.replace(editor.selection, result);
            });
          } else {
            const output = vscode.window.createOutputChannel("DevUtils");
            output.clear();
            output.appendLine(result);
            output.show(true);
          }
        } catch (err: any) {
          vscode.window.showErrorMessage(`DevUtils: ${err.message}`);
        }
      })
    );
  }
}

export function deactivate() {}

class DevUtilsViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.type === "execute") {
        try {
          // Check pro gating
          if (!FREE_TOOLS.has(msg.tool) && !isProUnlocked()) {
            webviewView.webview.postMessage({ type: "result", result: PRO_UPGRADE_MSG });
            return;
          }
          const result = executeTool(msg.tool, msg.args);
          webviewView.webview.postMessage({ type: "result", result });
        } catch (err: any) {
          webviewView.webview.postMessage({ type: "result", result: `Error: ${err.message}` });
        }
      } else if (msg.type === "copy") {
        vscode.env.clipboard.writeText(msg.text);
        vscode.window.showInformationMessage("Copied to clipboard!");
      } else if (msg.type === "insert") {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit(editBuilder => {
            if (editor.selection.isEmpty) {
              editBuilder.insert(editor.selection.active, msg.text);
            } else {
              editBuilder.replace(editor.selection, msg.text);
            }
          });
        }
      }
    });
  }

  private getHtml(): string {
    const toolsJson = JSON.stringify(TOOL_DEFS);
    const freeJson = JSON.stringify([...FREE_TOOLS]);
    const proUnlocked = isProUnlocked();

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: var(--vscode-sideBar-background);
    padding: 8px;
  }
  .search {
    width: 100%;
    padding: 6px 8px;
    margin-bottom: 8px;
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    outline: none;
  }
  .search:focus { border-color: var(--vscode-focusBorder); }
  .tool-list { max-height: 200px; overflow-y: auto; margin-bottom: 8px; }
  .tool-item {
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .tool-item:hover { background: var(--vscode-list-hoverBackground); }
  .tool-item.active { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
  .tool-item .pro-badge {
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 3px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    font-weight: bold;
  }
  .cat-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--vscode-descriptionForeground);
    padding: 6px 8px 2px;
    letter-spacing: 0.5px;
  }
  .form-area { display: none; }
  .form-area.visible { display: block; }
  .field { margin-bottom: 8px; }
  .field label {
    display: block;
    font-size: 11px;
    margin-bottom: 2px;
    color: var(--vscode-descriptionForeground);
  }
  .field input, .field select, .field textarea {
    width: 100%;
    padding: 4px 6px;
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border);
    border-radius: 3px;
    font-family: var(--vscode-editor-font-family);
    font-size: 12px;
  }
  .field textarea { min-height: 60px; resize: vertical; }
  .btn-row { display: flex; gap: 4px; margin-top: 8px; }
  .btn {
    flex: 1;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
  }
  .btn-primary {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }
  .btn-primary:hover { background: var(--vscode-button-hoverBackground); }
  .btn-secondary {
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
  }
  .result-area {
    display: none;
    margin-top: 8px;
    background: var(--vscode-editor-background);
    border: 1px solid var(--vscode-panel-border);
    border-radius: 4px;
    padding: 8px;
    font-family: var(--vscode-editor-font-family);
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 300px;
    overflow-y: auto;
  }
  .result-area.visible { display: block; }
  .result-actions { display: flex; gap: 4px; margin-top: 6px; }
  .result-actions .btn { flex: none; padding: 3px 8px; font-size: 11px; }
  .tool-header {
    font-weight: 600;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--vscode-panel-border);
  }
  .back-btn {
    font-size: 11px;
    color: var(--vscode-textLink-foreground);
    cursor: pointer;
    margin-bottom: 6px;
    display: inline-block;
  }
  .back-btn:hover { text-decoration: underline; }
  .upgrade-banner {
    background: var(--vscode-editorInfo-background, rgba(0,120,212,0.1));
    border: 1px solid var(--vscode-focusBorder);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    font-size: 11px;
    text-align: center;
  }
  .upgrade-banner a {
    color: var(--vscode-textLink-foreground);
    text-decoration: none;
    font-weight: 600;
  }
  .upgrade-banner a:hover { text-decoration: underline; }
  .tool-item .lock { opacity: 0.5; font-size: 10px; }
</style>
</head>
<body>
  <div id="list-view">
    <div id="upgrade-banner" class="upgrade-banner" style="display:none">
      15 free tools included. <a href="https://buymeacoffee.com/gl89tu25lp">Unlock 29 Pro tools</a>
    </div>
    <input class="search" id="search" placeholder="Search tools..." />
    <div class="tool-list" id="tool-list"></div>
  </div>
  <div id="form-view" class="form-area">
    <span class="back-btn" id="back-btn">&larr; Back</span>
    <div class="tool-header" id="tool-header"></div>
    <div id="fields"></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="run-btn">Run</button>
    </div>
    <div class="result-area" id="result"></div>
    <div class="result-actions" id="result-actions" style="display:none">
      <button class="btn btn-secondary" id="copy-btn">Copy</button>
      <button class="btn btn-secondary" id="insert-btn">Insert</button>
    </div>
  </div>

<script>
const vscode = acquireVsCodeApi();
const tools = ${toolsJson};
const freeTools = new Set(${freeJson});
const proUnlocked = ${proUnlocked};

const listView = document.getElementById('list-view');
const formView = document.getElementById('form-view');
const toolList = document.getElementById('tool-list');
const search = document.getElementById('search');
const fields = document.getElementById('fields');
const result = document.getElementById('result');
const resultActions = document.getElementById('result-actions');

let currentTool = null;

function renderList(filter = '') {
  const f = filter.toLowerCase();
  const grouped = {};
  tools.forEach(t => {
    if (f && !t.label.toLowerCase().includes(f) && !t.name.includes(f) && !t.category.toLowerCase().includes(f)) return;
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });
  toolList.innerHTML = '';
  for (const [cat, items] of Object.entries(grouped)) {
    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = cat;
    toolList.appendChild(label);
    items.forEach(t => {
      const el = document.createElement('div');
      el.className = 'tool-item';
      const locked = t.pro && !proUnlocked;
      el.innerHTML = t.label + (t.pro ? ' <span class="pro-badge">PRO</span>' : '') + (locked ? ' <span class="lock">&#128274;</span>' : '');
      el.onclick = () => openTool(t);
      toolList.appendChild(el);
    });
  }
}

function openTool(tool) {
  currentTool = tool;
  listView.style.display = 'none';
  formView.classList.add('visible');
  document.getElementById('tool-header').textContent = tool.label + (tool.pro ? ' [PRO]' : '');
  fields.innerHTML = '';
  result.classList.remove('visible');
  resultActions.style.display = 'none';

  tool.fields.forEach(f => {
    const div = document.createElement('div');
    div.className = 'field';
    const lbl = document.createElement('label');
    lbl.textContent = f.label + (f.required ? ' *' : '');
    div.appendChild(lbl);

    let input;
    if (f.type === 'select') {
      input = document.createElement('select');
      f.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        if (o === f.default) opt.selected = true;
        input.appendChild(opt);
      });
    } else if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else if (f.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = f.default === 'true';
    } else {
      input = document.createElement('input');
      input.type = f.type === 'number' ? 'number' : 'text';
    }
    input.id = 'field-' + f.name;
    if (f.default && f.type !== 'select' && f.type !== 'checkbox') input.value = f.default;
    if (f.placeholder) input.placeholder = f.placeholder;
    div.appendChild(input);
    fields.appendChild(div);
  });
}

document.getElementById('back-btn').onclick = () => {
  formView.classList.remove('visible');
  listView.style.display = 'block';
  currentTool = null;
};

document.getElementById('run-btn').onclick = () => {
  if (!currentTool) return;
  const args = {};
  currentTool.fields.forEach(f => {
    const el = document.getElementById('field-' + f.name);
    args[f.name] = f.type === 'checkbox' ? String(el.checked) : el.value;
  });
  vscode.postMessage({ type: 'execute', tool: currentTool.name, args });
};

document.getElementById('copy-btn').onclick = () => {
  vscode.postMessage({ type: 'copy', text: result.textContent });
};

document.getElementById('insert-btn').onclick = () => {
  vscode.postMessage({ type: 'insert', text: result.textContent });
};

window.addEventListener('message', e => {
  if (e.data.type === 'result') {
    result.textContent = e.data.result;
    result.classList.add('visible');
    resultActions.style.display = 'flex';
  }
});

search.oninput = () => renderList(search.value);

// Handle Enter key in fields
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && currentTool && e.target.tagName !== 'TEXTAREA') {
    document.getElementById('run-btn').click();
  }
});

if (!proUnlocked) {
  document.getElementById('upgrade-banner').style.display = 'block';
}

renderList();
</script>
</body>
</html>`;
  }
}

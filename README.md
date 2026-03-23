# DevUtils for VS Code

[![Version](https://img.shields.io/github/v/release/hlteoh37/devutils-vscode?style=flat-square)](https://github.com/hlteoh37/devutils-vscode/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**44 developer utilities** right inside your editor. No context switching, no browser tabs.

## Install

Download the latest `.vsix` from [Releases](https://github.com/hlteoh37/devutils-vscode/releases), then:

```
code --install-extension devutils-vscode-0.1.0.vsix
```

Or in VS Code: `Ctrl+Shift+P` → "Install from VSIX" → select the file.

## Features

- **15 Free Tools**: UUID, Hash, Base64, Timestamp, JWT Decode, Random String, URL Encode, JSON Format, Regex Test, Cron Explain, HMAC, Color Convert, HTTP Status, Slug, HTML Escape
- **29 Pro Tools**: Semver Compare, Chmod Calc, Text Diff, Number Base, Lorem Ipsum, Word Count, CIDR, Case Convert, Markdown TOC, Env Parser, IP Info, Password Strength, Data Size, String Escape, NanoID, CSV/JSON, Hex Encode, Char Info, Byte Count, JSON Diff, JWT Create, SQL Format, JSON Query, Epoch Convert, AES Encrypt/Decrypt, RSA Keygen, Scrypt Hash, Regex Replace

## Usage

1. Open the **DevUtils** sidebar panel (activity bar icon)
2. Search or browse tools by category
3. Fill in fields and click **Run**
4. **Copy** result or **Insert** into editor

### Quick Commands

Select text in your editor and run from the Command Palette (`Ctrl+Shift+P`):

- `DevUtils: Generate UUID`
- `DevUtils: Hash Text`
- `DevUtils: Base64 Encode / Decode`
- `DevUtils: Timestamp Convert`
- `DevUtils: Decode JWT`
- `DevUtils: URL Encode/Decode`
- `DevUtils: Format JSON`
- `DevUtils: Minify JSON`

Selected text is used as input. Result replaces the selection.

## Pro

15 tools are free forever. Unlock all 29 Pro tools with a license key ($5 one-time).

**[Get a Pro license](https://buymeacoffee.com/gl89tu25lp)** → enter the key in Settings > DevUtils.

## Also available as MCP Server

Use the same 44 tools in Claude Desktop, Cursor, Windsurf, or any MCP client:

```
npx -y mcp-devutils
```

See [mcp-devutils on npm](https://www.npmjs.com/package/mcp-devutils).

## Support

- [Buy Me a Coffee](https://buymeacoffee.com/gl89tu25lp)
- [GitHub Issues](https://github.com/hlteoh37/devutils-vscode/issues)

## License

MIT

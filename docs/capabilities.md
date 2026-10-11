# Optional Capabilities

## Browser

`PlaywrightBrowserProvider` implements observe → navigate → click/type → extract → screenshot. Playwright is intentionally optional; if it is not installed, the provider fails clearly instead of silently downgrading.

## Computer use

`ComputerUseProvider` defines screenshot/click/type as a vendor-neutral boundary. Platform-specific implementations can be supplied without changing the core.

## MCP

`McpClient` implements the stdio JSON-RPC lifecycle needed for MCP initialization, tool discovery, tool invocation, and shutdown, while filtering credential-shaped environment variables.

## Second opinion

`CliSecondOpinion` provides optional escalation to another installed coding CLI without making a model vendor mandatory.

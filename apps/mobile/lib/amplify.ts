import { Amplify } from "aws-amplify";

function loadOutputs(): unknown {
  try {
    // Same file as Next (`apps/web`): monorepo root, gitignored after sandbox/deploy.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("../../../amplify_outputs.json");
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("../dev-amplify-outputs.stub.json");
  }
}

try {
  const outputs = loadOutputs();
  const isStub =
    typeof outputs === "object" &&
    outputs !== null &&
    "_comment" in outputs &&
    typeof (outputs as { _comment?: unknown })._comment === "string";
  if (isStub) {
    console.info(
      "[mobile] No amplify_outputs.json at repo root — using dev stub. Run `npx ampx sandbox` (or deploy) for real Auth/Data.",
    );
  }
  Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0]);
} catch (err) {
  console.warn("[mobile] Amplify.configure failed.", err);
}

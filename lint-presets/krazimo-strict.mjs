// @krazimo/next-standards/strict — every borderline rule promoted to error.

import recommended from "./index.mjs";

const PROMOTE_TO_ERROR = ["max-lines"];

export default [
  ...recommended,
  {
    name: "krazimo/strict-overrides",
    rules: Object.fromEntries(PROMOTE_TO_ERROR.map((id) => [id, "error"])),
  },
];

import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLead } from "./lead.ts";

test("validateLead", () => {
  assert.equal(validateLead({ phone: "2098570195" }).error, "Please add your name.");
  assert.match(validateLead({ name: "Al", phone: "555" }).error!, /phone/);
  assert.match(validateLead({ name: "Al", phone: "209-857-0195", email: "nope" }).error!, /email/);
  const ok = validateLead({ name: " Al ", phone: "(209) 857-0195", truck_id: "" });
  assert.equal(ok.lead?.name, "Al");
  assert.equal(ok.lead?.truck_id, null);
  assert.equal(ok.lead?.source, "contact");
  assert.equal(validateLead({ name: "Al", phone: "2098570195", source: "finance" }).lead?.source, "finance");
  assert.equal(validateLead({ name: "Al", phone: "2098570195", source: "<script>" }).lead?.source, "contact");
});

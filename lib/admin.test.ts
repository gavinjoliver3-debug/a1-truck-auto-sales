import { test } from "node:test";
import assert from "node:assert/strict";
import { leadsByWeek, parseTruck, seed, stats, toCsv, validatePasswordChange } from "./admin.ts";
import { SAMPLE } from "./inventory.ts";

const now = Date.parse("2026-10-26T12:00:00Z");

test("seed + stats", () => {
  const s = seed(SAMPLE, now);
  const st = stats(s, now);
  assert.equal(st.listed, SAMPLE.length); // the two sold demo trucks are excluded
  assert.equal(st.pending, 1);
  assert.equal(st.sold30, 2);
  assert.equal(st.newLeads, 4);
  assert.equal(st.value, SAMPLE.reduce((n, t) => n + (t.price ?? 0), 0));
});

test("leadsByWeek buckets every lead inside the window", () => {
  const s = seed(SAMPLE, now);
  const weeks = leadsByWeek(s.leads, 8, now);
  assert.equal(weeks.length, 8);
  assert.equal(weeks.reduce((n, w) => n + w.count, 0), s.leads.length); // demo leads span < 8 weeks
});

test("parseTruck", () => {
  const ok = parseTruck({ year: "2018", make: " Ford ", model: "F-550", body: "dump", miles: "112,400", price: "$48,900", status: "sold", featured: "on" });
  assert.equal(ok.truck?.make, "Ford");
  assert.equal(ok.truck?.miles, 112400);
  assert.equal(ok.truck?.price, 48900);
  assert.equal(ok.truck?.status, "sold");
  assert.equal(parseTruck({ year: "2018", make: "Ford", model: "X", body: "dump", miles: "1", price: "" }).truck?.price, null);
  assert.match(parseTruck({ year: "1900", make: "Ford", model: "X", body: "dump", miles: "1" }).error!, /year/);
  assert.match(parseTruck({ year: "2018", make: "Ford", model: "X", body: "boat", miles: "1" }).error!, /body/);
  assert.equal(parseTruck({ year: "2018", make: "Ford", model: "X", body: "dump", miles: "1", vin: " 1fdug5gy0hea12345 " }).truck?.vin, "1FDUG5GY0HEA12345");
  assert.match(parseTruck({ year: "2018", make: "Ford", model: "X", body: "dump", miles: "1", vin: "IOQ123" }).error!, /VIN/);
});

test("toCsv escapes quotes, commas and spreadsheet formulas", () => {
  assert.equal(toCsv([{ a: 'say "hi", ok', b: "=SUM(A1)" }]), 'a,b\n"say ""hi"", ok",\'=SUM(A1)');
});

test("validatePasswordChange", () => {
  assert.match(validatePasswordChange("", "abc", "abc")!, /current/);
  assert.match(validatePasswordChange("old", "short1", "short1")!, /10 characters/);
  assert.match(validatePasswordChange("old", "onlyletters", "onlyletters")!, /number/);
  assert.match(validatePasswordChange("truckyard99", "truckyard99", "truckyard99")!, /different/);
  assert.match(validatePasswordChange("old", "truckyard99", "truckyard98")!, /match/);
  assert.equal(validatePasswordChange("old", "truckyard99", "truckyard99"), undefined);
});

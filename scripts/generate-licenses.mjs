/**
 * 오픈소스 라이선스 목록 생성 — 마이 > 오픈소스 라이선스(C18)가 읽는 JSON을 만든다.
 *
 * 앱에 실려 나가는 패키지(`npm ls --omit=dev --all`)를 모두 훑어 이름 · 버전 · 라이선스 · 저작권 줄을 모으고,
 * 라이선스 전문은 종류마다 한 번만 싣는다(MIT 전문 200벌을 넣으면 화면도 번들도 무거워진다).
 * 패키지 밖에서 들어온 것(Pretendard 글꼴)은 `MANUAL_ENTRIES`에 손으로 적는다.
 *
 * 의존성을 바꾸면 다시 돌린다: `npm run licenses` → 결과 JSON을 함께 커밋.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const ROOT = process.cwd();
const OUTPUT = join(ROOT, "src/features/mypage/data/openSourceLicenses.json");

const MANUAL_ENTRIES = [
  {
    // 글꼴 파일(src/common/assets/fonts)은 패키지가 아니라 버전 정보가 없다 — 문구는 시안 C18 그대로
    name: "Pretendard",
    version: "",
    license: "OFL-1.1",
    copyright: "Copyright (c) 2021 Kil Hyung-jin",
  },
];

/** SPDX 표기가 없거나 제각각인 것을 화면에 쓸 이름으로 맞춘다 */
function normalizeLicense(raw) {
  if (!raw) {
    return "UNKNOWN";
  }
  if (typeof raw === "string") {
    return raw.replace(/^\((.*)\)$/, "$1").trim();
  }
  if (Array.isArray(raw)) {
    return raw.map(item => normalizeLicense(item.type ?? item)).join(" OR ");
  }
  return normalizeLicense(raw.type);
}

function findLicenseFile(dir) {
  const file = readdirSync(dir).find(name => /^(licen[cs]e|copying)(\.(md|txt))?$/i.test(name));

  return file ? join(dir, file) : null;
}

/** 전문에서 저작권 줄만 — 화면의 각 항목에는 이 줄이 붙는다 */
function extractCopyright(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^(copyright|\(c\)|©)/i.test(line))
    .slice(0, 3)
    .join("\n");
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const parseable = execFileSync(npmCommand, ["ls", "--omit=dev", "--all", "--parseable"], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  shell: process.platform === "win32",
});

const seen = new Map();
const texts = {};

for (const dir of parseable.split(/\r?\n/).filter(Boolean)) {
  if (dir === ROOT || !existsSync(join(dir, "package.json"))) {
    continue;
  }
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const key = `${pkg.name}@${pkg.version}`;

  if (!pkg.name || seen.has(key) || pkg.private) {
    continue;
  }
  const license = normalizeLicense(pkg.license ?? pkg.licenses);
  const licenseFile = findLicenseFile(dir);
  const licenseText = licenseFile ? readFileSync(licenseFile, "utf8").trim() : "";

  if (licenseText && !texts[license]) {
    texts[license] = licenseText;
  }
  seen.set(key, {
    name: pkg.name,
    version: pkg.version,
    license,
    copyright: extractCopyright(licenseText),
  });
}

const packages = [...MANUAL_ENTRIES, ...[...seen.values()].sort((a, b) => a.name.localeCompare(b.name))];

writeFileSync(OUTPUT, `${JSON.stringify({ packages, texts }, null, 2)}\n`);
console.log(`${basename(OUTPUT)}: ${packages.length} packages · ${Object.keys(texts).length} license texts`);

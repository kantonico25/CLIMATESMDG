import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const getArgValue = (flag, fallback) => {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
};

const RUNS = Number(getArgValue("--runs", "3"));
const PORT = Number(getArgValue("--port", "4173"));
const HOST = getArgValue("--host", "127.0.0.1");
const PATHNAME = getArgValue("--path", "/");
const UPDATE_BASELINE = args.includes("--update-baseline");
const ASSERT_MODE = args.includes("--assert");

if (!Number.isFinite(RUNS) || RUNS < 1) {
  console.error("Invalid --runs value");
  process.exit(1);
}

const projectRoot = process.cwd();
const distPath = path.join(projectRoot, "dist");
if (!fs.existsSync(distPath)) {
  console.error("Missing dist/. Run `npm run build` first.");
  process.exit(1);
}

const outputDir = path.join(projectRoot, ".lighthouse");
fs.mkdirSync(outputDir, { recursive: true });
const nodeBin = process.execPath;
const lighthouseCli = path.join(projectRoot, "node_modules", "lighthouse", "cli", "index.js");
const viteCli = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");

if (!fs.existsSync(lighthouseCli)) {
  console.error("Missing Lighthouse CLI. Run `npm install`.");
  process.exit(1);
}

if (!fs.existsSync(viteCli)) {
  console.error("Missing Vite CLI. Run `npm install`.");
  process.exit(1);
}

const normalizedPath = PATHNAME.startsWith("/") ? PATHNAME : `/${PATHNAME}`;
const targetUrl = `http://${HOST}:${PORT}${normalizedPath}`;
const summaryPath = path.join(outputDir, "median-summary.json");
const baselinePath = path.join(outputDir, "baseline.json");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async (url, timeoutMs) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) return;
    } catch {
      // Retry until timeout.
    }
    await wait(500);
  }
  throw new Error(`Preview server did not become ready within ${timeoutMs}ms`);
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const toMetricSet = (report) => ({
  performance: Math.round(report.categories.performance.score * 100),
  fcp: report.audits["first-contentful-paint"].numericValue,
  lcp: report.audits["largest-contentful-paint"].numericValue,
  cls: report.audits["cumulative-layout-shift"].numericValue,
  tbt: report.audits["total-blocking-time"].numericValue,
  si: report.audits["speed-index"].numericValue
});

const runLighthouse = (url, reportPath) => {
  const cliArgs = [
    "--yes",
    "lighthouse",
    url,
    "--quiet",
    "--preset=perf",
    "--output=json",
    `--output-path=${reportPath}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--form-factor=mobile",
    "--throttling-method=simulate",
    "--screenEmulation.mobile=true",
    "--screenEmulation.width=390",
    "--screenEmulation.height=844",
    "--screenEmulation.deviceScaleFactor=2.625",
    "--screenEmulation.disabled=false",
    "--only-categories=performance"
  ];

  const run = spawnSync(nodeBin, [lighthouseCli, ...cliArgs], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "pipe"
  });

  if (run.status !== 0) {
    console.error(run.stdout);
    console.error(run.stderr);
    throw new Error(`Lighthouse run failed with exit code ${run.status ?? "unknown"}`);
  }
};

const buildBaseline = (summary) => ({
  createdAt: summary.generatedAt,
  url: summary.url,
  config: summary.config,
  baselineMedian: summary.median,
  thresholds: {
    performanceMin: Math.max(0, summary.median.performance - 3),
    fcpMax: summary.median.fcp + 250,
    lcpMax: summary.median.lcp + 250,
    clsMax: summary.median.cls + 0.02,
    tbtMax: summary.median.tbt + 50,
    siMax: summary.median.si + 300
  }
});

const assertAgainstBaseline = (summary, baseline) => {
  const checks = [
    { name: "performance", ok: summary.median.performance >= baseline.thresholds.performanceMin, actual: summary.median.performance, expected: `>= ${baseline.thresholds.performanceMin}` },
    { name: "fcp", ok: summary.median.fcp <= baseline.thresholds.fcpMax, actual: summary.median.fcp, expected: `<= ${baseline.thresholds.fcpMax}` },
    { name: "lcp", ok: summary.median.lcp <= baseline.thresholds.lcpMax, actual: summary.median.lcp, expected: `<= ${baseline.thresholds.lcpMax}` },
    { name: "cls", ok: summary.median.cls <= baseline.thresholds.clsMax, actual: summary.median.cls, expected: `<= ${baseline.thresholds.clsMax}` },
    { name: "tbt", ok: summary.median.tbt <= baseline.thresholds.tbtMax, actual: summary.median.tbt, expected: `<= ${baseline.thresholds.tbtMax}` },
    { name: "si", ok: summary.median.si <= baseline.thresholds.siMax, actual: summary.median.si, expected: `<= ${baseline.thresholds.siMax}` }
  ];

  const failures = checks.filter((check) => !check.ok);
  if (failures.length > 0) {
    console.error("Lighthouse regression detected:");
    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.actual} (expected ${failure.expected})`);
    }
    process.exit(1);
  }
};

const preview = spawn(nodeBin, [viteCli, "preview", "--host", HOST, "--port", String(PORT)], {
  cwd: projectRoot,
  stdio: "pipe"
});

preview.stdout.on("data", () => {});
preview.stderr.on("data", () => {});

const cleanup = () => {
  if (!preview.killed) {
    preview.kill("SIGTERM");
  }
};

process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  await waitForServer(targetUrl, 45_000);

  const runs = [];
  for (let i = 1; i <= RUNS; i += 1) {
    const reportPath = path.join(outputDir, `run-${i}.json`);
    runLighthouse(targetUrl, reportPath);
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    runs.push({ run: i, ...toMetricSet(report) });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    url: targetUrl,
    config: {
      runs: RUNS,
      formFactor: "mobile",
      throttlingMethod: "simulate",
      screenEmulation: {
        width: 390,
        height: 844,
        deviceScaleFactor: 2.625
      }
    },
    runs,
    median: {
      performance: median(runs.map((item) => item.performance)),
      fcp: median(runs.map((item) => item.fcp)),
      lcp: median(runs.map((item) => item.lcp)),
      cls: median(runs.map((item) => item.cls)),
      tbt: median(runs.map((item) => item.tbt)),
      si: median(runs.map((item) => item.si))
    }
  };

  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

  if (UPDATE_BASELINE) {
    const baseline = buildBaseline(summary);
    fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  }

  if (ASSERT_MODE) {
    if (!fs.existsSync(baselinePath)) {
      console.error(`Baseline missing at ${baselinePath}. Run with --update-baseline first.`);
      process.exit(1);
    }
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    assertAgainstBaseline(summary, baseline);
  }

  console.log(JSON.stringify({ summaryPath, baselinePath, updatedBaseline: UPDATE_BASELINE, asserted: ASSERT_MODE, median: summary.median }, null, 2));
} finally {
  cleanup();
}

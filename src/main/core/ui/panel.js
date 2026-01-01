import { config } from "../../../config/config.js";
import { createMetricsPanel, updateMetricsPanel } from "./panels/metrics.js";
import { createExpressionsPanel, updateExpressionsPanel } from "./panels/expressions.js";

let panelsRoot = null;
let enabledPanels = []; 

export function initDebugUI() {
  const showHud = !!config?.debug?.metrics || !!config?.modules?.expressions; 
  document.body.dataset.mode = showHud ? "debug" : "normal";

  panelsRoot = document.getElementById("panels");
  if (!panelsRoot || !showHud) return;

  panelsRoot.innerHTML = "";
  enabledPanels = [];

  const wantMetrics = !!config?.debug?.metrics;
  const wantExpr = !!config?.modules?.expressions;

  
  const order = [];
  if (wantMetrics) order.push("metrics");
  if (wantExpr) order.push("expressions");

  for (let i = 0; i < order.length; i++) {
    const key = order[i];

    if (key === "metrics") {
      panelsRoot.appendChild(createMetricsPanel());
      enabledPanels.push({ key, updateFn: updateMetricsPanel });
    }

    if (key === "expressions") {
      if (i > 0) panelsRoot.appendChild(createDivider());
      panelsRoot.appendChild(createExpressionsPanel());
      enabledPanels.push({ key, updateFn: updateExpressionsPanel });
    }
  }
}

function createDivider() {
  const div = document.createElement("div");
  div.className = "divider";
  return div;
}

export function updateDebugUI(state) {
  if (!enabledPanels.length) return;
  for (const p of enabledPanels) p.updateFn(state);
}

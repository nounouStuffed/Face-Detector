let el = null;

export function createExpressionsPanel() {
  const wrap = document.createElement("div");

  wrap.innerHTML = `
    <div class="panel-title">EXPRESSIONS</div>
    <div class="metric"><span>Top</span><span id="exprTop">-</span></div>
    <div class="metric"><span>Probability</span><span id="exprProb">-</span></div>
  `;

  queueMicrotask(() => {
    el = {
      top: document.getElementById("exprTop"),
      prob: document.getElementById("exprProb"),
    };
  });

  return wrap;
}

function setText(node, text, cls) {
  if (!node) return;
  node.textContent = text ?? "-";
  node.classList.remove("ok", "bad", "warn", "dim");
  if (cls) node.classList.add(cls);
}

export function updateExpressionsPanel(state = {}) {
  if (!el) return;

  const expr = state.expression;
  if (!expr) {
    setText(el.top, "-", "dim");
    setText(el.prob, "-", "dim");
    return;
  }

  const p = (expr.prob == null || !Number.isFinite(expr.prob)) ? null : expr.prob;
  const pTxt = p == null ? "-" : `${Math.round(p * 100)}%`;

  const cls = p != null && p >= 0.7 ? "ok" : (p != null && p >= 0.4 ? "warn" : "bad");

  setText(el.top, expr.label ?? "UNKNOWN", cls);
  setText(el.prob, pTxt, cls);
}

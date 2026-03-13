(function () {
  "use strict";

  const DEFAULT_FACTOR = 95.768752;
  const DECIMALS = 2;

  const factorInput = document.getElementById("factor");
  const entriesBody = document.getElementById("entriesTableBody");
  const addRowBtn = document.getElementById("addRowBtn");
  const grandTotalEl = document.getElementById("grandTotal");

  function parseNum(value) {
    const n = parseFloat(String(value).replace(/,/g, ""));
    return typeof n === "number" && isFinite(n) && n >= 0 ? n : 0;
  }

  function getFactor() {
    const f = parseFloat(String(factorInput.value).replace(/,/g, ""));
    return typeof f === "number" && isFinite(f) && f > 0 ? f : 0;
  }

  function costFormula(rendertimeMin, frames, octaneBench, factor) {
    if (!factor || !octaneBench) return 0;
    return rendertimeMin * frames * (factor / octaneBench);
  }

  function formatCost(value) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: DECIMALS,
      maximumFractionDigits: DECIMALS,
    });
  }

  function createRowElement(index, octaneBenchFromPrevious) {
    const tr = document.createElement("tr");
    tr.dataset.rowIndex = String(index);

    const tdFrames = document.createElement("td");
    const inputFrames = document.createElement("input");
    inputFrames.type = "number";
    inputFrames.min = "0";
    inputFrames.step = "1";
    inputFrames.inputMode = "numeric";
    inputFrames.className = "input-in-table";
    inputFrames.setAttribute("aria-label", "Frames");
    tdFrames.appendChild(inputFrames);

    const tdRendertime = document.createElement("td");
    const inputRendertime = document.createElement("input");
    inputRendertime.type = "number";
    inputRendertime.min = "0";
    inputRendertime.step = "any";
    inputRendertime.inputMode = "decimal";
    inputRendertime.className = "input-in-table";
    inputRendertime.setAttribute("aria-label", "Rendertime in minutes");
    tdRendertime.appendChild(inputRendertime);

    const tdOctane = document.createElement("td");
    const inputOctane = document.createElement("input");
    inputOctane.type = "number";
    inputOctane.min = "0";
    inputOctane.step = "any";
    inputOctane.inputMode = "decimal";
    inputOctane.className = "input-in-table";
    inputOctane.setAttribute("aria-label", "OctaneBench score");
    if (octaneBenchFromPrevious !== undefined && octaneBenchFromPrevious !== "") {
      inputOctane.value = String(octaneBenchFromPrevious);
    }
    tdOctane.appendChild(inputOctane);

    const tdCost = document.createElement("td");
    tdCost.className = "cost-cell";
    tdCost.setAttribute("aria-live", "polite");
    tdCost.textContent = formatCost(0);

    const tdRemove = document.createElement("td");
    tdRemove.className = "remove-cell";
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-remove";
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("aria-label", "Remove row");
    tdRemove.appendChild(removeBtn);

    tr.appendChild(tdFrames);
    tr.appendChild(tdRendertime);
    tr.appendChild(tdOctane);
    tr.appendChild(tdCost);
    tr.appendChild(tdRemove);

    function updateCost() {
      const factor = getFactor();
      const fr = parseNum(inputFrames.value);
      const rt = parseNum(inputRendertime.value);
      const ob = parseNum(inputOctane.value);
      const cost = costFormula(rt, fr, ob, factor);
      tdCost.textContent = formatCost(cost);
    }

    function onInput() {
      updateCost();
      updateGrandTotal();
    }

    inputFrames.addEventListener("input", onInput);
    inputFrames.addEventListener("change", onInput);
    inputRendertime.addEventListener("input", onInput);
    inputRendertime.addEventListener("change", onInput);
    inputOctane.addEventListener("input", onInput);
    inputOctane.addEventListener("change", onInput);

    removeBtn.addEventListener("click", function () {
      const rowCount = entriesBody.querySelectorAll("tr").length;
      if (rowCount <= 1) return;
      tr.remove();
      updateGrandTotal();
    });

    tr._updateCost = updateCost;
    tr._costCell = tdCost;

    return tr;
  }

  function updateGrandTotal() {
    const factor = getFactor();
    let total = 0;
    entriesBody.querySelectorAll("tr").forEach(function (tr) {
      const inputs = tr.querySelectorAll("input");
      if (inputs.length >= 3) {
        const fr = parseNum(inputs[0].value);
        const rt = parseNum(inputs[1].value);
        const ob = parseNum(inputs[2].value);
        total += costFormula(rt, fr, ob, factor);
      }
    });
    grandTotalEl.textContent = formatCost(total);
  }

  function addRow() {
    const rows = entriesBody.querySelectorAll("tr");
    const index = rows.length;
    const previousRow = index > 0 ? rows[index - 1] : null;
    const octaneBenchFromPrevious = previousRow
      ? previousRow.querySelectorAll("input")[2].value
      : undefined;
    const tr = createRowElement(index, octaneBenchFromPrevious);
    entriesBody.appendChild(tr);
    if (tr._updateCost) tr._updateCost();
    updateGrandTotal();
    tr.querySelector("input").focus();
  }

  addRowBtn.addEventListener("click", addRow);

  factorInput.addEventListener("input", function () {
    entriesBody.querySelectorAll("tr").forEach(function (tr) {
      if (tr._updateCost) tr._updateCost();
    });
    updateGrandTotal();
  });
  factorInput.addEventListener("change", function () {
    entriesBody.querySelectorAll("tr").forEach(function (tr) {
      if (tr._updateCost) tr._updateCost();
    });
    updateGrandTotal();
  });

  function init() {
    factorInput.value = String(DEFAULT_FACTOR);
    addRow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

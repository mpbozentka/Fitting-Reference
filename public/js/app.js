(function () {
  const { BRANDS, CROSS_REF, brandKeys, defaultBrand, defaultCategory } = window.__INITIAL__ || {};
  if (!BRANDS || !brandKeys || !brandKeys.length) return;

  let state = {
    brand: defaultBrand || brandKeys[0],
    category: defaultCategory || "drivers",
    expandedIndex: null,
    showCrossRef: false,
    searchTerm: "",
  };

  function setState(update) {
    Object.assign(state, update);
    render();
  }

  function setAccent(accent) {
    const a = accent || BRANDS[state.brand].accent;
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--badge-bg", a + "55");
    document.documentElement.style.setProperty("--notes-bg", a + "11");
    document.documentElement.style.setProperty("--notes-border", a + "33");
  }

  function filterItems(items) {
    if (!state.searchTerm) return items;
    const lower = state.searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        (item.model && item.model.toLowerCase().includes(lower)) ||
        (item.type && item.type.toLowerCase().includes(lower)) ||
        (item.bestFor && item.bestFor.toLowerCase().includes(lower)) ||
        (item.fittingNotes && item.fittingNotes.toLowerCase().includes(lower))
    );
  }

  function renderBrandTabs() {
    const el = document.getElementById("brandTabs");
    if (!el) return;
    el.innerHTML = brandKeys
      .map(
        (key) =>
          `<button type="button" class="brand-btn ${state.brand === key ? "active" : ""}" data-brand="${key}" style="${state.brand === key ? `border-color: ${BRANDS[key].accent}; background: ${BRANDS[key].accent}22` : ""}">${BRANDS[key].name}</button>`
      )
      .join("");
    el.querySelectorAll(".brand-btn").forEach((btn) => {
      btn.addEventListener("click", () => setState({ brand: btn.dataset.brand, expandedIndex: null }));
    });
  }

  function renderCatTabs() {
    const el = document.getElementById("catTabs");
    if (!el) return;
    const cats = ["drivers", "irons", "wedges"];
    el.innerHTML = cats
      .map(
        (c) =>
          `<button type="button" class="cat-btn ${state.category === c ? "active" : ""}" data-cat="${c}">${c}</button>`
      )
      .join("");
    setAccent();
    el.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => setState({ category: btn.dataset.cat, expandedIndex: null }));
    });
  }

  function renderCards() {
    const container = document.getElementById("cards");
    if (!container) return;
    const brandData = BRANDS[state.brand];
    const items = brandData[state.category] || [];
    const filtered = filterItems(items);

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty">No results found for "${state.searchTerm}"</div>`;
      return;
    }

    container.innerHTML = filtered
      .map((item, idx) => {
        const isExpanded = state.expandedIndex === idx;
        const isDrivers = state.category === "drivers";
        const isIrons = state.category === "irons";
        const isWedges = state.category === "wedges";
        const accent = brandData.accent;

        let metaHtml = "";
        if (isDrivers && (item.spin || item.launch || item.forgiveness)) {
          metaHtml = `
            <div class="card-meta">
              ${item.spin ? `<span><strong>SPIN </strong><span class="value">${item.spin}</span></span>` : ""}
              ${item.launch ? `<span><strong>LAUNCH </strong><span class="value">${item.launch}</span></span>` : ""}
              ${item.forgiveness ? `<span><strong>FORGIVE </strong><span class="value">${item.forgiveness}</span></span>` : ""}
              ${item.bias ? `<span><strong>BIAS </strong><span style="color:rgba(255,255,255,0.8);font-family:'DM Mono',monospace">${item.bias}</span></span>` : ""}
            </div>`;
        }
        if (isIrons && item.forgiveness) {
          metaHtml = `
            <div class="card-meta">
              <span><strong>FORGIVE </strong><span class="value">${item.forgiveness}</span></span>
              ${item.distance ? `<span><strong>DISTANCE </strong><span class="value">${item.distance}</span></span>` : ""}
              ${item.feel ? `<span><strong>FEEL </strong><span class="value">${item.feel}</span></span>` : ""}
            </div>`;
        }

        let detailsHtml = "";
        if (isExpanded) {
          let sections = "";
          if (isDrivers) {
            if (item.lofts) sections += section("Lofts Available", item.lofts);
            if (item.adjustability) sections += section("Adjustability", item.adjustability);
            if (item.stockShafts) sections += section("Stock Shafts", item.stockShafts);
            if (item.premiumShafts) sections += section("Premium Shafts", item.premiumShafts);
          }
          if (isIrons) {
            if (item.construction) sections += section("Construction", item.construction);
            if (item.lofts) sections += section("Lofts", item.lofts);
            if (item.stockShafts) sections += section("Stock Shafts", item.stockShafts);
          }
          if (isWedges) {
            if (item.construction) sections += section("Construction", item.construction);
            if (item.lofts) sections += section("Lofts", item.lofts);
            if (item.grinds) sections += section("Grinds", item.grinds);
            if (item.bounceRange) sections += section("Bounce Range", item.bounceRange);
            if (item.finishes) sections += section("Finishes", item.finishes);
            if (item.stockShafts) sections += section("Stock Shafts", item.stockShafts);
          }
          const notes = item.fittingNotes
            ? `<div class="fitting-notes"><div class="label">⚡ Fitting Notes</div><div class="body">${escapeHtml(item.fittingNotes)}</div></div>`
            : "";
          detailsHtml = `<div class="card-details">${sections}${notes}</div>`;
        }

        const badges = [
          item.type ? `<span class="badge badge-accent">${escapeHtml(item.type)}</span>` : "",
          item.headSize ? `<span class="badge">${escapeHtml(item.headSize)}</span>` : "",
          item.price ? `<span class="badge" style="background:rgba(255,255,255,0.08)">${escapeHtml(item.price)}</span>` : "",
        ]
          .filter(Boolean)
          .join("");

        const quick = item.bestFor || item.construction || "";

        return `
          <div class="card ${isExpanded ? "expanded" : ""}" data-index="${idx}" style="border-left-color: ${accent}">
            <div class="card-header">
              <div>
                <h3 class="card-title">${escapeHtml(item.model)}</h3>
                ${badges}
              </div>
              <span class="card-chevron">▾</span>
            </div>
            <p class="card-quick">${escapeHtml(quick)}</p>
            ${metaHtml}
            ${detailsHtml}
          </div>`;
      })
      .join("");

    function section(label, body) {
      return `<div class="section"><div class="section-label">${escapeHtml(label)}</div><div class="section-body">${escapeHtml(body)}</div></div>`;
    }

    container.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.index, 10);
        setState({ expandedIndex: state.expandedIndex === idx ? null : idx });
      });
    });
  }

  function escapeHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function render() {
    renderBrandTabs();
    renderCatTabs();
    renderCards();

    const btnCrossRef = document.getElementById("btnCrossRef");
    const panel = document.getElementById("crossRefPanel");
    if (btnCrossRef && panel) {
      panel.classList.toggle("hidden", !state.showCrossRef);
      btnCrossRef.classList.toggle("active", state.showCrossRef);
      btnCrossRef.textContent = state.showCrossRef ? "✕ Close" : "⇆ Cross-Ref";
      btnCrossRef.setAttribute("aria-pressed", state.showCrossRef);
    }
  }

  document.getElementById("btnCrossRef")?.addEventListener("click", () => setState({ showCrossRef: !state.showCrossRef }));

  document.getElementById("search")?.addEventListener("input", (e) => setState({ searchTerm: e.target.value.trim(), expandedIndex: null }));

  render();
})();

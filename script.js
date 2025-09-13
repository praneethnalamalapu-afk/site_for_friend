const filterToggle = document.getElementById("filterToggle");
    const filterOptions = document.getElementById("filterOptions");
    const activeFilter = document.getElementById("activeFilter");
    const listEl = document.getElementById("product-list");

    let productsData = [];      // raw from JSON but normalized
    let currentView = [];       // currently rendered array

    // Robust price parser: strips any non-digit
    function parsePriceToNumber(priceLike) {
      if (typeof priceLike === "number") return priceLike;
      if (!priceLike) return 0;
      const onlyDigits = String(priceLike).replace(/[^\d]/g, ""); // remove ₹, commas, spaces
      return Number(onlyDigits || 0);
    }

    // Normalize once after fetch for speed & reliability
    function normalizeProducts(arr) {
      return arr.map(p => {
        const hashtags = Array.isArray(p.hashtags) ? p.hashtags : [];
        const lowerTags = hashtags.map(tag => String(tag).toLowerCase().trim());
        return {
          ...p,
          _priceValue: parsePriceToNumber(p.price),
          _tags: lowerTags
        };
      });
    }

    function renderProducts(items) {
      listEl.innerHTML = "";
      if (!items.length) {
        listEl.innerHTML = '<div class="empty">No products found for this filter.</div>';
        return;
      }
      items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price}</p>
        `;
        card.onclick = () => {
          window.location.href = `products_.html?id=${product.id}`;
        };
        listEl.appendChild(card);
      });
    }

    function setActiveFilterLabel(label) {
      activeFilter.innerHTML = `Showing: <strong>${label}</strong>`;
    }

    function applyFilter(type) {
      let result = [...productsData];
      switch (type) {
        case "low-high":
          result.sort((a, b) => a._priceValue - b._priceValue);
          setActiveFilterLabel("Price: Low → High");
          break;
        case "high-low":
          result.sort((a, b) => b._priceValue - a._priceValue);
          setActiveFilterLabel("Price: High → Low");
          break;
        case "gold":
          result = result.filter(p => p._tags.includes("gold"));
          setActiveFilterLabel("Gold");
          break;
        case "silver":
          result = result.filter(p => p._tags.includes("silver"));
          setActiveFilterLabel("Silver");
          break;
        case "fashion":
          result = result.filter(p => p._tags.includes("fashion"));
          setActiveFilterLabel("Best in Fashion");
          break;
        case "all":
        default:
          setActiveFilterLabel("All");
          break;
      }
      currentView = result;
      renderProducts(currentView);
      // close dropdown after applying
      filterOptions.style.display = "none";
    }

    // Toggle dropdown
    filterToggle.addEventListener("click", () => {
      filterOptions.style.display = filterOptions.style.display === "block" ? "none" : "block";
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!filterOptions.contains(e.target) && e.target !== filterToggle) {
        filterOptions.style.display = "none";
      }
    });

    // Handle clicks on options (event delegation)
    filterOptions.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      const type = btn.getAttribute("data-filter");
      applyFilter(type);
    });

    // Fetch & boot
    fetch("products.json")
      .then(res => res.json())
      .then(json => {
        productsData = normalizeProducts(json);
        currentView = [...productsData];
        renderProducts(currentView);
      })
      .catch(err => {
        console.error("Failed to load products.json", err);
        listEl.innerHTML = '<div class="empty">Could not load products. Check the console.</div>';
      });
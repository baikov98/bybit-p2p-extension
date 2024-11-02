const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px" id="custom-close-svg-button">
    <path
        d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
</svg>
`;

const inputsElStr = `
  <div class="p2p-custom-limit-filters">
    <input placeholder="Min Limit" type="number" class="min">
    <div>-</div>
    <input placeholder="Max Limit" type="number" class="max">
  </div>
`;

const hideClassName = "p2p-custom-hidden-row";

const bannersRemover = () => {
  const tradeMainListEl = document.querySelector(".trade-list__main");
  if (tradeMainListEl) {
    const childBannerEls = Array.from(tradeMainListEl.children).filter(
      (el) => !el.classList.contains("trade-list__wrapper")
    );
    childBannerEls.forEach((bannerEl) => {
      const svgClose = new DOMParser().parseFromString(
        svgString,
        "application/xml"
      ).firstChild;
      svgClose.addEventListener("click", () => {
        svgClose.parentElement.remove();
      });
      bannerEl.appendChild(svgClose);
    });
  }
};

const hideElement = (el) => {
  el.classList.add(hideClassName);
};

const showElement = (el) => {
  el.classList.remove(hideClassName);
};

let inputMinEl = null;
let inputMaxEl = null;
let tradeTableBody = null;

const updateTableByFilters = () => {
  const minInputValue = Number(inputMinEl.value) || 0;
  const maxInputValue = Number(inputMaxEl.value) || Infinity;
  const rows = tradeTableBody.querySelectorAll("tr");
  Array.from(rows).forEach((row) => {
    if (minInputValue > maxInputValue) {
      showElement(row);
      return;
    }

    Array.from(row.querySelectorAll(".ql-value")).forEach((valueEl) => {
      const textContent = valueEl.textContent;
      if (!textContent.includes("~")) {
        return;
      }
      const [minText, maxText] = textContent.split("~");
      const min = parseInt(minText.replace(",", ""));
      const max = parseInt(maxText.replace(",", ""));

      if (minInputValue > max || maxInputValue < min) {
        hideElement(row);
        return;
      }
      showElement(row);
    });
  });
};

const addFilters = () => {
  const filtersContainer = document.getElementById("guide-step-two");
  tradeTableBody = document.querySelector(".trade-table__tbody");
  if (filtersContainer) {
    filtersContainer.style.flexWrap = "wrap";
    const inputs = document.createElement("div");
    inputs.innerHTML = inputsElStr;
    filtersContainer.appendChild(inputs);
    inputMinEl = filtersContainer.querySelector(".min");
    inputMaxEl = filtersContainer.querySelector(".max");

    inputMinEl.addEventListener("input", () => updateTableByFilters());
    inputMaxEl.addEventListener("input", () => updateTableByFilters());

    let observer = new MutationObserver((mutationRecords) => {
      updateTableByFilters();
    });

    observer.observe(tradeTableBody, {
      childList: true, // наблюдать за непосредственными детьми
    });
  }
};

let enabled = null;

chrome.storage.sync.get(["enabled"], (result) => {
  enabled = result.enabled;
});

window.addEventListener("load", function () {
  if (enabled) {
    bannersRemover();
    addFilters();
  }
});

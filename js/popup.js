const enableCheckbox = document.querySelector(".enabled-checkbox");

if (enableCheckbox) {
  chrome.storage.sync.get(["enabled"], (result) => {
    enableCheckbox.checked = result.enabled;
  });

  enableCheckbox.addEventListener("click", async (e) => {
    console.log(e);
    const checked = e.target.checked;
    chrome.storage.sync.set({ enabled: checked });
  });
}

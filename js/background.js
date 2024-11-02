chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.sync.set({ enabled: true });

  let url = chrome.runtime.getURL("html/hello.html");
  await chrome.tabs.create({ url });
});

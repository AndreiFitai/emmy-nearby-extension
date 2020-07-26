function setURL(url) {
  document.getElementsByTagName("iframe").src = `${url}/?extension=true`;
  document.getElementById("sourceUrlInput").placeholder = url
}

chrome.storage.local.get(["sourceUrl"], function ({ sourceUrl }) {
  if (!sourceUrl) {
    document.getElementById("scootData").innerHTML =
      "<h3>No source URL set yet</h3>";
  } else if (document.getElementById("scootData").getElementsByTagName("h3")) {
    document.getElementById("scootData").innerHTML = `<iframe
    src=${sourceUrl}/?extension=true
    frameborder="0"
    style="width: 350px; height: 450px;"
    ></iframe>`;
    document.getElementById("sourceUrlInput").placeholder = sourceUrl
  } else setURL(sourceUrl);
});

document.getElementById("changeBtn").addEventListener("click", function (e) {
  var sourceUrl = document.getElementById("sourceUrlInput").value;
  chrome.runtime.sendMessage({ sourceUrl });
});

chrome.runtime.onMessage.addListener(function ({ redraw }, sender) {
  if (redraw) {
    location.reload();
  }
});

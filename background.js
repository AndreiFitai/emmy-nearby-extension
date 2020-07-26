"use strict";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ sourceUrl: "" }, function () {
    console.log("Source URL not set yet");
  });
});

chrome.runtime.onMessage.addListener(function({sourceUrl}, sender) {
  if(sourceUrl){
    chrome.storage.local.set({ sourceUrl }, function () {
      console.log("Source Url set to", sourceUrl);
    });
    chrome.runtime.sendMessage({'redraw': true, sourceUrl});
  }
});

let sourceUrl;
chrome.runtime.onStartup.addListener(function () {
  chrome.storage.local.get(["sourceUrl"], function (data) {
    console.log("Value currently is " + data.sourceUrl);
    sourceUrl = data.sourceUrl;
  }); 
});

if (sourceUrl) {
  const source = new EventSource(`${sourceUrl}/subscribe`);

  //to be modified later to show time to walk to scooter
  source.addEventListener("myEvent", (event) => {
    console.log("----- event ------", event);
    draw(JSON.parse(event.data).count);
  });
} else {
  draw(":(");
}

function draw(distance) {
  const SIZE = 32;
  var canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;

  var context = canvas.getContext("2d");
  context.fillStyle = "#eb6b49";
  context.fillRect(0, 0, SIZE, SIZE);
  context.fillStyle = "#FFFFFF";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 20px Tahoma";
  context.fillText(distance, 16, 16);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, SIZE, SIZE),
  });
}

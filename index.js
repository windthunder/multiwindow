// 填色用顏色
const colors = [
  '#2196F3',
  '#E91E63',
  '#FFEB3B',
  '#74FF1D'
];

// get time now
let now = Date.now();
// 選擇顏色 看起來像是隨機的
let color = colors[now % colors.length];

// 產生一個自定義事件 browserMove
function browserMoveEventGenerator() {
  let browserMoveEvent = new CustomEvent("browserMove");

  let oldX = 0;
  let oldY = 0;
  document.addEventListener("DOMContentLoaded", function (){
    oldX = window.screenX;
    oldY = window.screenY;
    let loop = function () {
      if(window.screenX !== oldX || window.screenY !== oldY){
        window.dispatchEvent(browserMoveEvent);
        oldX = window.screenX;
        oldY = window.screenY;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });
}

browserMoveEventGenerator();

// 輔助函數 計算innerScreenX, innerScreenY
function getBrowserPosition() {
  // compute width of borders
  var borderWidth = (window.outerWidth - window.innerWidth) / 2;

  // compute absolute page position
  var innerScreenX = window.screenX + borderWidth;
  var innerScreenY = (window.outerHeight - window.innerHeight - borderWidth) + window.screenY;

  // 檢查用
  // document.getElementById('data').innerHTML = `innerScreenX: ${innerScreenX}, innerScreenY: ${innerScreenY}`

  return { x: innerScreenX, y: innerScreenY };
}

// 輔助函數 計算視窗中心點相對螢幕的位置
function getCenter() {
  var browserPosition = getBrowserPosition();
  var centerX = browserPosition.x + window.innerWidth / 2;
  var centerY = browserPosition.y + window.innerHeight / 2;

  // 檢查用
  document.getElementById('data').innerHTML = `centerX: ${centerX}, centerY: ${centerY}`

  return { x: centerX, y: centerY };
}

function onResize() {
  // 修改canvas#main的寬高 等於 100vh 100vw
  mainCanvas.width = document.getElementById('pos').clientWidth;
  mainCanvas.height = document.getElementById('pos').clientHeight;

  savePosition();

  // clear canvas
  clearCanvas();

  drawCircle(window.innerWidth / 2, window.innerHeight / 2);
  drawLineToAll();
}

// 清除畫布
function clearCanvas() {
  ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
}

// 畫圓
function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// 畫線
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); // 起點
  ctx.lineTo(x2, y2); // 終點
  ctx.strokeStyle = color;
  ctx.stroke();
}

// 繪製連結所有中心點的線
function drawLineToAll() {
  console.log(window.localStorage);
  let keys = Object.keys(window.localStorage);
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;
  let {x, y} =getBrowserPosition();
  for (let i = 0; i < keys.length; i++) {
    let pos = JSON.parse(window.localStorage.getItem(keys[i]));
    drawLine(centerX, centerY, pos.x - x, pos.y - y);
  }
}

// 將中心點位置存到localStorage
function savePosition() {
  window.localStorage.setItem(now, JSON.stringify(getCenter()));
}

let mainCanvas, ctx;

// on document ready
document.addEventListener("DOMContentLoaded", function (e) {
  mainCanvas = document.getElementById('main');
  ctx = mainCanvas.getContext('2d');
  onResize();
});

// on resize
window.addEventListener('resize', onResize);

// on beforeunload
window.addEventListener('beforeunload', function (e) {
  // 將中心點位置去掉
  delete window.localStorage[now];
});

window.addEventListener("browserMove", function() {
  clearCanvas();
  drawCircle(window.innerWidth / 2, window.innerHeight / 2);
  drawLineToAll();
  savePosition();
});


window.addEventListener('storage', function(e) {
  clearCanvas();
  drawCircle(window.innerWidth / 2, window.innerHeight / 2);
  drawLineToAll();
});
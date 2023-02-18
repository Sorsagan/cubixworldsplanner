const container = document.querySelector('.container');
const resetBtn = document.querySelector('.btn');
const { body } = document;
const blocklist = document.querySelector('.blocks');
const block = document.querySelectorAll('.block');
let draw = false;
let blockimg = '';

function populate(size) {
  block.forEach((item) => {
    const img = item.querySelector('img');
    img.addEventListener('load', () => {
      console.log('Image loaded:', img.src);
    });
    item.addEventListener('click', (e) => {
      const img = e.target.nodeName === 'IMG' ? e.target : e.target.querySelector('img');
      blockimg = img.src;
      console.log('Selected image:', blockimg);
    });
  });

  container.style.setProperty('--size', size);
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div');
    div.classList.add('pixel');
    div.addEventListener('mouseover', function(e){
      if (e.buttons === 1) { // left button is pressed
        div.style.backgroundImage = `url(${blockimg})`;
      } else if (e.buttons === 2) { // right button is pressed
        div.style.backgroundImage = 'none';
      }
    });
    div.addEventListener('click', function(){
      div.style.backgroundImage = `url(${blockimg})`;
    });
    container.addEventListener('contextmenu', function(e) {
      e.preventDefault(); // prevent default right click menu from showing up
      if (e.target.classList.contains('pixel')) {
        e.target.style.backgroundImage = 'none'; // set pixel background to none
      }
    });

    container.appendChild(div);
  }
}

window.addEventListener('mousedown', function(){
  draw = true;
});

window.addEventListener('mouseup', function(){
  draw = false;
});

function reset() {
  container.innerHTML = '';
  populate(100);
}

resetBtn.addEventListener('click', reset);

populate(100);

let zoomActivate = false;
container.addEventListener('mousewheel', (e) => {
  var y = e.deltaY
  if(y < 0){
    zoomActivate = true;
  }
  if(y > 0){
    zoomActivate = false;
  }
  });

container.addEventListener('mousewheel', (e) => {
  const { clientX: x, clientY: y } = e;
  if (zoomActivate) {
    body.style.transform = 'scale(2.5)';
    body.style.transformOrigin = `${x}px ${y}px`;
  } else {
    body.style.transform = 'none';
  }
});

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.querySelector('.download');
downloadBtn.addEventListener('click', function() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  ctx.fillStyle = '#1c1c1d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  html2canvas(container, { useCORS: true }).then(function(canvas) {
    ctx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

window.addEventListener('beforeunload', function (e) {
  if (blockimg !== '') {
    e.preventDefault();
    e.returnValue = '';
  }
})
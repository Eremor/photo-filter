const filtersContainer = document.querySelector('.filters');
const btnContainer = document.querySelector('.btn-container');
const fileInput = btnContainer.querySelector('#btnInput');
const filters = document.querySelectorAll('input[type="range"]');
const btnFullScreen = document.querySelector('.fullscreen')

const canvas = document.querySelector('canvas');
const imageBase = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const imageList = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let time = 'day';
let imageIndex = 0;

const img = new Image();

function changeFilter(e) {
  e.target.nextElementSibling.value = e.target.value;
  updateCanvas(img)
}

function onClickBtn(e) {
  if(e.target.classList.contains('btn-reset')) {
    resetFilters();
  }
  if(e.target.classList.contains('btn-next')) {
    viewNextImage();
    fileInput.value = '';
  }
  if(e.target.classList.contains('btn-save')) {
    saveImage();
  }
}

function resetFilters() {
  filters.forEach(filter => {
    if (filter.name === 'saturate') {
      filter.value = 100;
      filter.nextElementSibling.value = 100;
    } else {
      filter.value = 0;
      filter.nextElementSibling.value = 0;
    }
    updateCanvas(img)
  })
}

function getTime() {
  let date = new Date();
  let minutes = (date.getHours() * 60) + date.getMinutes();
  
  if(minutes >= 1080 && minutes <= 1439){
    time = 'evening';
  } else if(minutes >= 720 && minutes <= 1079) {
    time = 'day';
  } else if(minutes >= 360 && minutes <= 719) {
    time = 'morning';
  } else if(minutes >= 0 && minutes <= 359) {
    time = 'night';
  } else {
    throw 'Not time';
  }

  return time;
}

function viewNextImage() {
  const index = imageIndex % imageList.length;
  const imageSrc = `${imageBase}${getTime()}/${imageList[index]}`;
  drawImageToCanvas(imageSrc);
  imageIndex++;
}

function drawImageToCanvas(src) {
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = src;
  img.onload = () => {
    updateCanvas(img)
  }
}

function loadImage() {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    drawImageToCanvas(reader.result);
  }
  reader.readAsDataURL(file);
}

function saveImage() {
  const downloadImage = document.createElement('a');
  downloadImage.download = 'download.png';
  downloadImage.href = canvas.toDataURL('image/png');
  downloadImage.click();
  downloadImage.delete;
}

function applyFilterToCanvas() {
  let blur = 0;
  let invert = 0;
  let sepia = 0;
  let saturate = 100;
  let hue = 0;
  filters.forEach(filter => {
    switch(filter.name) {
      case 'blur':
        blur = `${filter.value}${filter.dataset.sizing}`;
        break;
      case 'invert':
        invert = `${filter.value}${filter.dataset.sizing}`;
        break;
      case 'sepia':
        sepia = `${filter.value}${filter.dataset.sizing}`;
        break;
      case 'saturate':
        saturate = `${filter.value}${filter.dataset.sizing}`;
        break;
      case 'hue':
        hue = `${filter.value}${filter.dataset.sizing}`;
        break;
    }
  });

  return `blur(${blur}) invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue})`;
}

function toggleFullScreen() {
  if(!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if(document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

function updateCanvas(img) {
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.filter = applyFilterToCanvas();
  ctx.drawImage(img, 0, 0);
}

drawImageToCanvas('assets/img/img.jpg');
filtersContainer.addEventListener('input', changeFilter);
btnContainer.addEventListener('click', onClickBtn);
fileInput.addEventListener('change', loadImage);
btnFullScreen.addEventListener('click', toggleFullScreen);
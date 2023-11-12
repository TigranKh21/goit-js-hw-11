import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '40632330-75f4a7e3fdd59698a6ace0990';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const searchEl = document.getElementById('search-form');
searchEl.addEventListener('submit', onFormSubmit);
const galleryEl = document.querySelector('.gallery');

function onFormSubmit(event) {
  event.preventDefault();
  const userRequest = event.currentTarget.searchQuery.value;
  fetchData(userRequest).then(data => {
    const resArray = data.data.hits;
    if (!resArray.length) {
      onError();
    }
    onRender(resArray);
    console.log(resArray);
  });
}

async function fetchData(userRequest) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: userRequest,
    image_type: 'photo',
    orientation: 'horozontal',
    safesearch: 'true',
  });
  const response = await axios.get('?' + params);
  return response;
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onRender(arr) {
  const smallImg = arr.largeImageURL;
  const markup = arr
    .map(element => {
      return `<div class="item-wrapper"><div class="photo-card">
  <img src="${element.previewURL}" alt="${element.tags}" loading="lazy" width="100%" height=auto/>
  <div class="info">
    <p class="info-item">
      <b>Likes<br/></b><span>${element.likes}</span>
    </p>
    <p class="info-item">
      <b>Views<br/></b><span>${element.views}</span>
    </p>
    <p class="info-item">
      <b>Comments<br/></b><span>${element.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads<br/></b><span>${element.downloads}</span>
    </p>
  </div>
</div></div>`;
    })
    .join('');
  galleryEl.innerHTML = markup;
}

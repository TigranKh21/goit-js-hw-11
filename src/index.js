import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '40632330-75f4a7e3fdd59698a6ace0990';
const params = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horozontal',
  safesearch: 'true',
  page: 1,
  per_page: 40,
};

const refs = {
  searchEl: document.getElementById('search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

refs.searchEl.addEventListener('submit', onFormSubmit);
refs.loadMoreEl.addEventListener('click', onLoadNextPage);

function onFormSubmit(event) {
  event.preventDefault();
  params.q = event.currentTarget.searchQuery.value;
  fetchData(params).then(data => {
    const resArray = data.data.hits;
    const foundPosts = data.data.totalHits;
    if (!resArray.length) {
      onError();
    } else {
      Notiflix.Notify.success(`WOW! We found ${foundPosts} images!`);
    }
    refs.galleryEl.innerHTML = '';
    onRender(resArray);
    refs.loadMoreEl.classList.remove('js-hidden');
  });
}

function onLoadNextPage(event) {
  event.preventDefault();
  params.page++;
  fetchData(params).then(data => {
    const resArray = data.data.hits;
    onRender(resArray);
  });
}

async function fetchData(params) {
  params = new URLSearchParams(params);
  const response = await axios.get('?' + params);
  return response;
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onRender(arr) {
  const markup = arr
    .map(element => {
      return `<div class="photo-card">
  <div class="image-link"><a href="${element.largeImageURL}">
  <img src="${element.previewURL}" alt="${element.tags}" loading="lazy" width="100%" height=auto/>
  </a></div>
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
</div>`;
    })
    .join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  onLiteBox();
}

function onLiteBox() {
  const gallery = new SimpleLightbox('.image-link a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

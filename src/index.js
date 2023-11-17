import Notiflix from 'notiflix';
import { fetchData, onRender } from './func';

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
  params.page = 1;
  fetchData(params).then(data => {
    const resArray = data.data.hits;
    const foundPosts = data.data.totalHits;
    if (!resArray.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please another request.'
      );
      refs.loadMoreEl.classList.add('js-hidden');
      return;
    } else {
      Notiflix.Notify.success(`WOW! We found ${foundPosts} images!`);
    }
    refs.galleryEl.innerHTML = '';
    onRender(resArray, refs.galleryEl);
    if (params.page === Math.ceil(data.data.totalHits / params.per_page)) {
      refs.loadMoreEl.classList.add('js-hidden');
    } else {
      refs.loadMoreEl.classList.remove('js-hidden');
    }
  });
}

function onLoadNextPage(event) {
  event.preventDefault();
  params.page++;
  fetchData(params).then(data => {
    const resArray = data.data.hits;
    onRender(resArray, refs.galleryEl);
    if (params.page === Math.ceil(data.data.totalHits / params.per_page)) {
      refs.loadMoreEl.classList.add('js-hidden');
    }
  });
}

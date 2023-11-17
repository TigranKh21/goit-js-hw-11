import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('.image-link a', {
  captionsData: 'alt',
  captionDelay: 250,
});

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchData(params) {
  params = new URLSearchParams(params);
  const response = await axios.get('?' + params);
  return response;
}

export function onMarkup(arr) {
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
  return markup;
}

export function onRender(array, locator) {
  const markup = onMarkup(array);
  locator.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

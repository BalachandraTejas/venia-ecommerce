let listProductHTML = document.querySelector('.list-products');
let products = [];
let displayProducts = [];
let checkbox = [];
let sort = '';
const LOAD_LIMIT = 10;
let loadMoreClickCount = 1;

const shimmerHTML = `<div class="shimmerBG media"></div>
        <div class="p-32">
          <div class="shimmerBG title-line"></div>
          <div class="shimmerBG title-line end"></div>
        </div>`;
let loading = document.createElement('span');
loading.className = 'card';
loading.innerHTML = shimmerHTML;
let loading1 = document.createElement('span');
loading1.className = 'card';
loading1.innerHTML = shimmerHTML;
let loading2 = document.createElement('span');
loading2.className = 'card';
loading2.innerHTML = shimmerHTML;

const getProductsData = fetch('https://fakestoreapi.com/products')
  .then((r) => {
    if (r.ok) return r.json();
    throw new Error('API not responding');
  })
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.log('Error: ', error);
  });

const addDataToHTML = () => {
  document.querySelector('.list-products').replaceChildren();
  if (products.length > 0) {
    const showProducts = displayProducts.length ? displayProducts : products;
    document.getElementById('display-count').innerText =
      showProducts.length + ' Results';
    showProducts.forEach((product) => {
      let newProduct = document.createElement('div');
      newProduct.dataset.id = product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = `<img loading="lazy" src="${product.image}" alt="">
                <div class="product-data"><h2>${product.title}</h2>
                <div class="price">$${product.price}</div></div>`;
      //   listProductHTML.appendChild(newProduct);
      document.querySelector('.list-products').appendChild(newProduct);
    });
    if (showProducts.length >= products.length) {
      let loadMore = document.getElementById('loadMore');
      loadMore.style = 'display: none';
    }
  }
};

window.onload = async () => {
  document.querySelector('.list-products').append(loading, loading2, loading1);
  products = await getProductsData;
  displayProducts = [...products].slice(0, LOAD_LIMIT);
  addDataToHTML();
  // console.log('onload', products);
  var el = document.getElementById('loadMore');
  el.onclick = function (e) {
    e.preventDefault();
    if (LOAD_LIMIT * loadMoreClickCount < products.length) {
      loadMoreClickCount++;
      displayProducts = products.slice(0, LOAD_LIMIT * loadMoreClickCount);
      console.log(displayProducts, loadMoreClickCount);
      addDataToHTML();
    }
  };
};

function handleCheckbox(value) {
  if (!checkbox.includes(value)) checkbox.push(value);
  else checkbox = checkbox.filter((item) => item !== value);
  displayProducts = products.filter((product) =>
    checkbox.includes(product.category)
  );
  sortDisplayedProducts(sort);
  addDataToHTML();
}

function handleSort(value) {
  sort = value;
  sortDisplayedProducts(sort);
  addDataToHTML();
}

function sortDisplayedProducts(sortDir) {
  if (sortDir === 'asc')
    displayProducts = displayProducts.sort((p1, p2) => p1.price - p2.price);
  else if (sortDir === 'desc')
    displayProducts = displayProducts.sort((p1, p2) => p2.price - p1.price);
  else displayProducts = displayProducts.sort((p1, p2) => p1.id - p2.id);
}

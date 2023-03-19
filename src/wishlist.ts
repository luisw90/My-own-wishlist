const listContainer = document.getElementById('wishlist')!;

let wishList: WishListItem[] = [];

type WishListItem = {
  description?: string
  id: string
  status: Boolean
  title: string
};

const addItem = (item: WishListItem) => {
  wishList.unshift(item);
  localStorage.setItem('WishList', JSON.stringify(wishList));
  window.dispatchEvent(new Event('statechange'));
};

const ItemStatusChange = (event: any) => {
  const itemValue = event.target.value;
  const itemIndex = wishList.findIndex(i => i.id === itemValue);
  const item = wishList[itemIndex];

  if (item.status === true) {
    wishList[itemIndex].status = false;
    wishList.splice(itemIndex, 1);
    wishList.unshift(item);
  } else {
    wishList[itemIndex].status = true;
    wishList.splice(itemIndex, 1);
    wishList.push(item);
  }
  localStorage.setItem('WishList', JSON.stringify(wishList));
  window.dispatchEvent(new Event('statechange'));
};

const ItemDelete = (event: any) => {
  const itemValue = event.target.value;
  const itemIndex = wishList.findIndex(i => i.id === itemValue.id);
  wishList.splice(itemIndex, 1);

  localStorage.setItem('WishList', JSON.stringify(wishList));
  window.dispatchEvent(new Event('statechange'));
};

const deleteAllItems = () => {
  wishList = [];
  window.localStorage.clear();
  window.dispatchEvent(new Event('statechange'));
};

const renderList = () => {
  listContainer!.innerHTML = '';

  wishList.forEach((wishlistItem: WishListItem) => {
    let cardStatusClass = '';
    let checkedCheckBox = '';
    let deleteButton = '';

    if (wishlistItem.status === true) {
      cardStatusClass = 'list__item--completed';
      deleteButton = `<button value="${wishlistItem.id}" id="deleteButton" class="wishlist__delete-button" data-testid="btnDeleteCard" >Delete</button>`;
      checkedCheckBox = 'checked';
    }

    listContainer!.innerHTML += `
      <div class="wishlist__card ${cardStatusClass}" id="item-${wishlistItem.id}">
        <div class="wishlist__card-inner">
          <div>
            <p class="wishlist__text" >${wishlistItem.title}</p>
            <p class="wishlist__text" >${wishlistItem.description}</p>
          </div>
          <div>
            <label class="switch" data-testid="cardItem">
              <input value="${wishlistItem.id}" id="wishlist__card-checkbox" class="wishlist__card-checkbox" type="checkbox" ${checkedCheckBox}>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div>
          ${deleteButton}
        </div>
      </div>`;
  });

  const statusCheckboxes = listContainer.querySelectorAll('.wishlist__card-checkbox');
  statusCheckboxes.forEach(node => {
    node.addEventListener('click', ItemStatusChange);
  });

  const deleteButtons = listContainer.querySelectorAll('#deleteButton');
  deleteButtons.forEach(node => {
    node.addEventListener('click', ItemDelete);
  });

  const deleteAllButton = document.querySelector('#Delete-all-button')!;
  if (wishList.length > 0) {
    deleteAllButton.classList.remove('Delete-all-button-hidden');
  } else {
    deleteAllButton.classList.add('Delete-all-button-hidden');
  }
};

const handleSubmit = (event: any) => {
  event.preventDefault();

  const form = event.target;
  const title = form.elements.title.value;
  const description = form.elements.description.value;

  const wishListItem: WishListItem = {
    id: `${Date.now()}`,
    description,
    status: false,
    title,
  };

  addItem(wishListItem);
  renderList();
  form.reset();
};

const startApp = () => {
  const localStorageWishList = localStorage.getItem('WishList');
  if (localStorageWishList) {
    wishList = JSON.parse(localStorageWishList);
  }
  const form = <HTMLFormElement>document.querySelector('#form')!;
  const deleteAllButton = document.querySelector('#Delete-all-button')!;

  deleteAllButton.addEventListener('click', deleteAllItems);
  form.addEventListener('submit', handleSubmit);
  window.addEventListener('statechange', renderList);
  renderList();
};

startApp();

(function() {
  const host = 'http://127.0.0.1:3000';
  const usersEl = document.querySelector('.js-users');
  const preloaderEl = document.querySelector('.js-preloader');
  const modalEl = document.querySelector('.js-modal')

  // Получение списка пользователей с сервера
  async function getUsers(term) {
    try {
      let response = {};
      if (term) {
        response = await fetch(`${host}?term=${term}`);
      } else {
        response = await fetch(`${host}`);
      }
      
      const users = await response.json();       
      return users;

    } catch(error) {
      alert(error);
    }   
  }

  /* ----------------------- ПОИСК ------------------------ */
  // функция debounce
  function debounce(f, t) {
    return function (args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && ((this.lastCall - previousCall) <= t)) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(() => f(args), t);
    }
  }

  const search = debounce(async (event) => {    
    usersEl.innerHTML = ''
    preloaderEl.classList.add('preloader--load');
    users = await getUsers(event.target.value);
    showUsers(users);
  }, 1000);
  
  const searchEl = document.querySelector('.js-search');
  searchEl.addEventListener('input', search);

  const searchSubmitEl = document.querySelector('.js-search-submit');  
  searchSubmitEl.addEventListener('submit', async (e) => {
    e.preventDefault();
  });
  /* ------------------------------------------------------- */

  // Модальное окно
  const myModal = new HystModal({
    linkAttributeName: "data-hystmodal"
  });

  // Открывает модальное окно
  function openModal(user) {
    myModal.open('#userModal');
    modalEl.innerHTML = `
      <button data-hystclose class="hystmodal__close modal__close">Закрыть</button>

      <h2 class="modal__title">${user.name}</h2>

      <ul class="modal__info list-reset info">
        <li class="info__wrap">
          <p class="info__title">Телефон:</p>
          <a class="info__value" href="tel:+7${user.phone}">${user.phone}</a>
        </li>

        <li class="info__wrap">
          <p class="info__title">Почта:</p>
          <a class="info__value" href="mailto:${user.email}"">${user.email}</a>          
        </li>

        <li class="info__wrap">
          <p class="info__title">Дата приема:</p>
          <p class="info__value">${user.hire_date}</p>
        </li>

        <li class="info__wrap">
          <p class="info__title">Должность:</p>
          <p class="info__value">${user.position_name}</p>
        </li>

        <li class="info__wrap">
          <p class="info__title">Подразделение:</p>
          <p class="info__value">${user.department}</p>
        </li>
      </ul>

      <p class="info__descr-title">Дополнительная информация:</p>
      <p class="info__descr">${user.address}</p>
    `;   
  }

  // Создание элемента li с карточкой с данными клиента
  function getUserEl(user) {
    const userEl = document.createElement('li');    
    userEl.classList.add('main__item');
    
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    cardEl.setAttribute('tabindex', '0');
    
    cardEl.innerHTML = `
        <h2 class="card__title">${user.name}</h2>
        <a class="card__phone" href="tel:+7${user.phone.replace(/[^0-9]/g,"")}">${user.phone}</a>
        <a class="card__mail" href="mailto:${user.email}">${user.email}</a>
    `;

    cardEl.addEventListener('click', (e) => {
      const stopOpenModal = e.target.classList.contains('card__phone') || e.target.classList.contains('card__mail');
      if (!stopOpenModal) {
        openModal(user);
      }
    })

    userEl.append(cardEl);

    return userEl;
  }

  // Показывает всех клиентов в таблице
  function showUsers(users) {
    usersEl.innerHTML = '';
    preloaderEl.classList.remove('preloader--load');

    if (!users.length) usersEl.innerHTML=`Ничего не найдено`;

    users.forEach(user => {
      const userEl = getUserEl(user);
      usersEl.append(userEl);
    })
  }  

  /* ------------- Запуск приложения ------------------ */
  async function start() {  
    users = await getUsers();
    showUsers(users);
  }
  
  start();
  /* --------------------------------------------------- */  
})();
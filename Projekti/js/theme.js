'use strict';

const arrButtons = document.getElementsByClassName('switch');

for (const button of arrButtons) {
  button.addEventListener('click', changeTheme);
}

/* switch between .css files based on button inputs */
function changeTheme() {
  console.log(this.name);
  let link = document.querySelector(".stylesheet");
  switch (this.name) {
    case 'mainTheme1':
      link.setAttribute('href', "css/main.css");
      sessionStorage.setItem('theme', 'theme1');
      break;

    case 'mainTheme2':
      link.setAttribute('href', "css/main2.css");
      sessionStorage.setItem('theme', 'theme2');
      break;

    case 'mainTheme3':
      link.setAttribute('href', "css/main3.css");
      sessionStorage.setItem('theme', 'theme3');
      break;

    case 'infoTheme1':
      link.setAttribute('href', "css/info.css");
      sessionStorage.setItem('theme', 'theme1');
      break;

    case 'infoTheme2':
      link.setAttribute('href', "css/info2.css");
      sessionStorage.setItem('theme', 'theme2');
      break;

    case 'infoTheme3':
      link.setAttribute('href', "css/info3.css");
      sessionStorage.setItem('theme', 'theme3');
      break;

    case 'authorsTheme1':
      link.setAttribute('href', "css/authors.css");
      sessionStorage.setItem('theme', 'theme1');
      break;

    case 'authorsTheme2':
      link.setAttribute('href', "css/authors2.css");
      sessionStorage.setItem('theme', 'theme2');
      break;

    case 'authorsTheme3':
      link.setAttribute('href', "css/authors3.css");
      sessionStorage.setItem('theme', 'theme3');
      break;

    default:
      console.log('error');
  }
}
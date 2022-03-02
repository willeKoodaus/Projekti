'use strict';

const arrButtons = document.getElementsByClassName('switch');

for (const button of arrButtons) {
  button.addEventListener('click', changeTheme);
}

function changeTheme(event) {
  console.log(this.name);
  let link = document.querySelector(".stylesheet");
  switch (this.name) {
    case 'mainTheme1':
      link.setAttribute('href', "css/main.css");
      break;

    case 'mainTheme2':
      link.setAttribute('href', "css/main2.css");
      break;

    case 'mainTheme3':
      link.setAttribute('href', "css/main3.css");
      break;

    case 'infoTheme1':
      link.setAttribute('href', "css/info.css");
      break;

    case 'infoTheme2':
      link.setAttribute('href', "css/info2.css");
      break;

    case 'infoTheme3':
      link.setAttribute('href', "css/info3.css");
      break;

    default:
      console.log('error');
  }
}
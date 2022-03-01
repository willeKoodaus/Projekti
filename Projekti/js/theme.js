'use strict';

const arrButtons = document.getElementsByClassName('switch');

for (const button of arrButtons) {
  button.addEventListener('click', changeTheme);
}

function changeTheme(event) {
  console.log(this.name);
  let link = document.querySelector(".stylesheet");
  switch (this.name) {
    case 'theme1':
      link.setAttribute('href', "css/main1.css");
      break;

    case 'theme2':
      link.setAttribute('href', "css/main2.css");
      break;

    case 'theme3':
      link.setAttribute('href', "css/main3.css");
      break;

    default:
      console.log('error');
  }
}
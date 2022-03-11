'use strict';

if (sessionStorage.getItem('theme')) {
  let cssElement = document.querySelector('.stylesheet');
  const theme = sessionStorage.getItem('theme');
  const windowName = window.document.title;

  switch (windowName) {
    case 'Aktiviteettikartta':
      switch (theme) {
        case 'theme1':
          console.log('theme was default');
          cssElement.setAttribute('href', 'css/main.css');
          break;
        case 'theme2':
          cssElement.setAttribute('href', 'css/main2.css');
          break;
        case 'theme3':
          cssElement.setAttribute('href', 'css/main3.css');
          break;
        default:
          console.log('error in switch case Main');
      }
      break;

    case 'Web-tekniikat ja digitaalinen media -projekti':
      switch (theme) {
        case 'theme1':
          console.log('theme was default');
          cssElement.setAttribute('href', 'css/info.css');
          break;
        case 'theme2':
          cssElement.setAttribute('href', 'css/info2.css');
          break;
        case 'theme3':
          cssElement.setAttribute('href', 'css/info3.css');
          break;
        default:
          console.log('error in switch case Info');
      }
      break;

    case 'Tekijöiden kuvat':
      switch (theme) {
        case 'theme1':
          console.log('theme was default');
          cssElement.setAttribute('href', 'css/authors.css');
          break;
        case 'theme2':
          cssElement.setAttribute('href', 'css/authors2.css');
          break;
        case 'theme3':
          cssElement.setAttribute('href', 'css/authors3.css');
          break;
        default:
          console.log('error in switch case Info');
      }
      break;

    default:
      console.log('error with theme storage');
  }

} else {
  sessionStorage.setItem('theme', 'theme1');
}

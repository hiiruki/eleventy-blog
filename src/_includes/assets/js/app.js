const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

/**
 *  Theme switcher
 */
const html = $('html')
const themeButton = $('.js-theme-btn')

let themeClass = {
  dark: 'ThemeButton--Dark',
  light: 'ThemeButton--Light',
}

// Add the current theme class to display the correct icon in the UI
themeButton.classList.add(themeClass[html.dataset.theme || 'dark'])

/**
 *  Toggle between light/dark classes when the button is clicked and store the value in local 
 *  localStorage which is used to know the selected theme on repeated visits
 */
themeButton.addEventListener('click', event => {
  let currentTheme = html.dataset.theme || 'dark';
  let selectedTheme = currentTheme === 'dark' ? 'light' : 'dark';
  let textLabel = `Activate ${currentTheme} mode`;

  event.currentTarget.classList.remove(themeClass[currentTheme])
  event.currentTarget.classList.add(themeClass[selectedTheme])

  event.currentTarget.setAttribute('title', textLabel)
  event.currentTarget.setAttribute('aria-label', textLabel)

  html.dataset.theme = selectedTheme;
  localStorage.setItem('currentTheme', selectedTheme);
})
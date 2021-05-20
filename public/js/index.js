const links = document.querySelectorAll('.nav-link')

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach(item => item.classList.remove('current'))
    // link.classList.remove('current')
    link.classList.add('current')
  })
})

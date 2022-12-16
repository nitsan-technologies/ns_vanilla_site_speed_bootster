class VanillaSiteSpeedBooster {
  constructor(config) {
    this.options = {
      excludeUrls: '/blog',
      enableProgressBar: false,
      idBundleJs: 'pageAjax',
      langSwitch: '.header-language-menu a',
      mainClassName: '.site-main',
      pageBackForwardReload: true,
      removeUsingPageClass: '.offer-page-header',
      removeUsingTargetClass: 'lang-menu-item',
      errorMsg: 'Something is went wrong for NsWebsiteWithoutReload plugin',
      headerCollapse: false,
    };

    if (typeof config === 'object') {
      this.options = { ...this.options, ...config };
    }

    // call our init function
    if (!document.body.className.includes('ns-website-content')) {
      this.init();
    }
  }

  init() {
    const mainSection = document.querySelector(`${this.options.mainClassName}`);
    const menuLinks = document.querySelectorAll('a:not([target])');

    // If user click on back button page was reload
    if (this.options.pageBackForwardReload) {
      window.onpopstate = () => {window.location.reload();};
    }

    if (menuLinks.length && mainSection && !document.querySelector(`${this.options.removeUsingPageClass}`)) {
      menuLinks.forEach((i) => {
        if (!i.hasAttribute('data-fancybox')) {
          i.addEventListener('click', (event) => {
            menuLinks.forEach((j) => {
              j.parentElement.classList.remove('active');
            });
            event.target.parentElement.classList.add('active');
          });
        }
      });

      document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' && !event.target.hasAttribute('target') && !event.target.hasAttribute('data-fancybox')  && !event.target.hasAttribute('data-bs-toggle', 'modal') && !event.target.hasAttribute('data-glightbox') && !event.target.hasAttribute('data-darkbox') && !event.target.className.includes('cboxElement') ) {
          if (event.target.href.split('#').length === 1 && event.target.href.indexOf(`${this.options.excludeUrls}`) === -1 && !event.target.className.includes(this.options.removeUsingTargetClass)) {
            event.preventDefault();
            document.body.classList.add('ns-website-content');
            if (this.options.enableProgressBar) {
              NProgress.configure({
                speed: 500,
                trickleSpeed: 600,
                showSpinner: false,
              });
              NProgress.start();
              /* Scroll Top Of The Page */
              window.scroll({
                top: 0,
              });
            }

            if (this.options.headerCollapse) {
              const menuTrigger = document.querySelector('#menuTrigger');
              const bodyDiv = document.querySelector('body');
              bodyDiv.classList.remove('menu--open');
              menuTrigger.addEventListener('click', () => {
                bodyDiv.classList.toggle('menu--open');
              });

              if (event.target.parentElement.classList.contains('has-sub')) {
                event.target.parentNode.classList.toggle('active');
                event.target.parentNode.classList.toggle('slide--up');
              }
            }

            const url = event.target.href;
            fetch(url, {cache: "force-cache"}).then((response) => response.text()).then((html) => {
              /* Change Content of Main */
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const mainContent = doc.querySelector(`${this.options.mainClassName}`);
              const langLink = document.querySelector(`${this.options.langSwitch}`);
              mainSection.classList.add('fade');
              setTimeout(() => {
                mainSection.innerHTML = mainContent.innerHTML;
                mainSection.className = mainContent.className;
                window.history.pushState(null, null, url);
                document.querySelector('title').innerHTML = doc.title;

                if (langLink.href && doc.querySelector(`${this.options.langSwitch}`) && doc.querySelector(`${this.options.langSwitch}`).href) {
                  langLink.href = doc.querySelector(`${this.options.langSwitch}`).href;
                }

                if (this.options.enableProgressBar) {
                  NProgress.done();
                }

                if (this.options.idBundleJs) {
                  const script = document.createElement('script');
                  script.src = document.getElementById(`${this.options.idBundleJs}`).src;

                  // append and execute script
                  mainSection.append(script);
                }
              }, 300);
            }).catch((err) => {
                console.warn(this.options.errorMsg, err);
              });
          } else if (event.target.getAttribute('href').charAt(0) !== '#' && event.target.className === 'lang-menu-item') {
            window.location.href = event.target.href;
          }
        }
      });
    }
  }
}

export default VanillaSiteSpeedBooster;

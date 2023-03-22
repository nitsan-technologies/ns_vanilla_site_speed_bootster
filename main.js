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
      removeUsingTargetClass: ['exclude-ajax-link', 'lang-menu-item'],
      removeWithoutReloadUsingTargetClass: ['exclude-ajax-link', 'lang-menu-item'],
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

  checkExcludeLinks(currentClassName, arrRemoveClass) {
    var isExclude = false;
    if(currentClassName != '') {
      const arrExcludeClass = currentClassName.split(' ');
      if(arrExcludeClass.length) {
        arrExcludeClass.map((isClassName, index) => {
          if(arrRemoveClass.includes(isClassName.replace(/\s/g, ''))) {
            isExclude = true;
          }
        });
      }
    }
    return isExclude;
  }
  checkExcludeWithoutReloadLinks(currentClassName, arrRemoveClass) {
    var isWithOutReloadExclude = false;
    if(currentClassName != '') {
      const arrExcludeClass = currentClassName.split(' ');
      if(arrExcludeClass.length) {
        arrExcludeClass.map((isClassName, index) => {
          if(arrRemoveClass.includes(isClassName.replace(/\s/g, ''))) {
            isWithOutReloadExclude = true;
          }
        });
      }
    }
    return isWithOutReloadExclude;
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
        if (event.target.href && !event.target.href.includes('tel:') && !event.target.href.includes('mailto:') && event.target.tagName === 'A' && !event.target.hasAttribute('target') && !event.target.hasAttribute('data-fancybox') && !event.target.hasAttribute('data-bs-toggle', 'modal') && !event.target.hasAttribute('data-glightbox') && !event.target.hasAttribute('data-darkbox') && !event.target.className.includes('cboxElement') ) {
          // Let's check for exclude links
          const isExcludeClass = this.checkExcludeLinks(event.target.className, this.options.removeUsingTargetClass);
          const isWithoutReloadExcludeClass = this.checkExcludeLinks(event.target.className, this.options.removeWithoutReloadUsingTargetClass);
          // Let's redirect to exclude links and #-links
          if (event.target.getAttribute('href').charAt(0) !== '#' && isExcludeClass && !isWithoutReloadExcludeClass) {
            window.location.href = event.target.href;
          } else if (!event.target.href.includes('javascript:;') && event.target.href.split('#').length === 1 && event.target.href.indexOf(`${this.options.excludeUrls}`) === -1 && !isExcludeClass && !isWithoutReloadExcludeClass) {
            event.preventDefault();
            document.body.classList.add('ns-website-content');
            if (this.options.enableProgressBar) {
              NProgress.configure({
                speed: 500,
                trickleSpeed: 600,
                showSpinner: false,
              });
              NProgress.start();
            }

            /* Scroll Top Of The Page */
            window.scroll({
              top: 0,
            });

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
            window.history.pushState(null, null, url);
            fetch(url, {cache: "force-cache"}).then((response) => response.text()).then((html) => {
              /* Change Content of Main */
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const mainContent = doc.querySelector(`${this.options.mainClassName}`);
              const langLink = document.querySelector(`${this.options.langSwitch}`);
              mainSection.classList.add('fade');
              setTimeout(() => {
                if (mainContent) {
                  mainSection.innerHTML = mainContent.innerHTML;
                  mainSection.className = mainContent.className;
                }
                if (doc.title) {
                  document.querySelector('title').innerHTML = doc.title;
                }

                if (langLink && langLink.href && doc.querySelector(`${this.options.langSwitch}`) && doc.querySelector(`${this.options.langSwitch}`).href) {
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
          } else if (event.target.getAttribute('href').charAt(0) == '#') {
            event.preventDefault();
            window.history.pushState(null, null, event.target.getAttribute('href'));
            document.querySelector(event.target.getAttribute('href')).scrollIntoView()
          }
        }
      });
    }
  }
}

export default VanillaSiteSpeedBooster;

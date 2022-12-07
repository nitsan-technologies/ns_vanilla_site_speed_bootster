class VanillaSiteSpeedBooster {
  constructor(config) {
    this.options = {
      attributeLightboxPlugin: 'data-fancybox',
      excludeExternalLink: true,
      excludeUrls: '/blog',
      enableHashtag: true,
      enableHashUrlReload: true,
      enableProgressBar: true,
      addBundleJsPath: '/typo3conf/ext/ns_theme_child/Resources/Public/dist/assets/js/theme.bundle.js',
      idBundleJsPath: 'pageAjax',
      errorMsg: 'Something is went wrong for NsWebsiteWithoutReload plugin',
      mainClassName: 'site-main',
      pageBackReload: true,
      removeFromPage: 'offer-page-header',
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
    const mainSection = document.querySelector(`.${this.options.mainClassName}`);
    const menuLinks = document.querySelectorAll('a:not([target])');

    // If user click on back button page was reload
    window.onpopstate = () => {
      window.location.reload();
    };

    if (menuLinks.length && mainSection && !document.querySelector(`.${this.options.removeFromPage}`)) {
      menuLinks.forEach((i) => {
        if (!i.hasAttribute(`${this.options.attributeLightboxPlugin}`)) {
          i.addEventListener('click', (event) => {
            menuLinks.forEach((j) => {
              j.parentElement.classList.remove('active');
            });
            event.target.parentElement.classList.add('active');
          });
        }
      });

      document.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.tagName === 'A' && !event.target.hasAttribute('target') && !event.target.hasAttribute(`${this.options.attributeLightboxPlugin}`)) {
          if (event.target.href.split('#').length === 1 && event.target.href.indexOf(`${this.options.excludeUrls}`) === -1 && !event.target.hasAttribute(`${this.options.attributeLightboxPlugin}`)) {
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

            const url = event.target.href;
            fetch(url)
              .then((response) => response.text())
              .then((html) => {
                /* Change Content of Main */
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const mainContent = doc.querySelector(`.${this.options.mainClassName}`);
                mainSection.classList.add('fade');
                setTimeout(() => {
                  mainSection.innerHTML = mainContent.innerHTML;
                  mainSection.className = mainContent.className;
                  window.history.pushState(null, null, url);
                  document.querySelector('title').innerHTML = doc.title;

                  if (this.options.enableProgressBar) {
                    NProgress.done();
                  }

                  const script = document.createElement('script');
                  script.src = this.options.addBundleJsPath;

                  // append and execute script
                  mainSection.append(script);

                  if (document.getElementById(`${this.options.idBundleJsPath}`)) {
                    document.getElementById(`${this.options.idBundleJsPath}`).remove();
                  }
                }, 300);
              })
              .catch((err) => {
                console.warn(this.options.errorMsg, err);
              });
          } else if (event.target.getAttribute('href').charAt(0) !== '#') {
            window.location.href = event.target.href;
          }
        }
      });
    }
  }
}

export default NsWebsiteWithoutReload;

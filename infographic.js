(() => {
  const courseUrls = {
    'it-gonna': 'https://www.udemy.com/course/corso-di-sartoria-su-misura-gonna-base-dritta-alta-moda/?referralCode=50F219BB823BF87417B7',
    'en-skirt': 'https://www.udemy.com/course/custom-tailoring-course-basic-straight-skirt-elegant-style/?referralCode=C6232FE60BF9D2B7B486',
    'es-falda': 'https://www.udemy.com/course/curso-de-sastreria-disena-corta-y-cose-una-falda-a-medida/?referralCode=448E730A8E5041D59BF8',
    'it-tasca': 'https://www.udemy.com/course/come-realizzare-la-tasca-alla-francese-per-pantaloni-e-gonne/?referralCode=0FEC0F422E3E145CA75C',
    'en-pocket': 'https://www.udemy.com/course/how-to-sew-a-french-pocket-professional-tailoring-method/?referralCode=6A5E76C35FBA6AD98555',
    'pt-saia': 'https://www.udemy.com/course/curso-de-costura-saia-reta-basica/?referralCode=4DF53EC2D13301D64841',
    'pt-bolso': 'https://www.udemy.com/course/curso-de-costura-como-fazer-bolso-faca/?referralCode=47BABDEA1AE9707D9013',
    'de-rock': 'https://www.udemy.com/course/verbessere-deine-narfertigkeiten-gerader-basisrock/?referralCode=1CF6E3DB1AAD082207AE'
  };
  const frame = document.querySelector('.infographic-frame');
  const img = frame?.querySelector('.infographic');
  const hotspot = frame?.querySelector('.udemy-hotspot');
  if (!frame || !img) return;

  const courseKey = document.body.dataset.course || '';
  const configured = courseUrls[courseKey] || (typeof d !== 'undefined' ? d.url || '' : '');
  const existing = hotspot?.getAttribute('href') || '';
  const courseLink = configured.startsWith('http')
    ? configured
    : existing.startsWith('http')
      ? existing
      : [...document.querySelectorAll('[data-cta]')]
          .map((node) => node.getAttribute('href') || '')
          .find((href) => href.startsWith('http')) || '';

  if (hotspot) {
    if (courseLink) {
      hotspot.href = courseLink;
      hotspot.target = '_blank';
      hotspot.rel = 'noopener sponsored';
      hotspot.setAttribute('aria-label', hotspot.dataset.label || 'Open course on Udemy');
    } else {
      hotspot.remove();
    }
  }

  if (courseLink) {
    document.querySelectorAll('[data-cta]').forEach((link) => {
      link.href = courseLink;
      link.target = '_blank';
      link.rel = 'noopener sponsored';
    });
  }

  const labels = {
    it: 'Vai al corso su Udemy',
    en: 'View the course on Udemy',
    de: 'Kurs auf Udemy ansehen',
    es: 'Ver el curso en Udemy',
    pt: 'Ver o curso na Udemy'
  };
  const language = (document.documentElement.lang || 'en').slice(0, 2);
  const ctaLabel = labels[language] || labels.en;

  const dialog = document.createElement('dialog');
  dialog.className = 'image-lightbox';
  dialog.setAttribute('aria-label', img.alt || 'Course infographic');
  dialog.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">×</button>
    <div class="lightbox-stage">
      <img alt="">
      ${courseLink ? '<a class="lightbox-hotspot"></a>' : ''}
    </div>
    ${courseLink ? `<a class="lightbox-cta">${ctaLabel} <span aria-hidden="true">↗</span></a>` : ''}
    <p class="lightbox-hint"></p>`;

  dialog.querySelectorAll('.lightbox-hotspot, .lightbox-cta').forEach((link) => {
    link.href = courseLink;
    link.target = '_blank';
    link.rel = 'noopener sponsored';
    link.setAttribute('aria-label', ctaLabel);
  });

  const full = dialog.querySelector('.lightbox-stage img');
  full.alt = img.alt;
  dialog.querySelector('.lightbox-hint').textContent = frame.dataset.closeHint || 'Press Esc or × to close';
  document.body.append(dialog);

  const show = () => {
    if (!full.src) full.src = img.dataset.fullsrc || img.src;
    dialog.showModal();
  };
  const open = (event) => {
    if (event.target.closest('.udemy-hotspot')) return;
    show();
  };

  img.addEventListener('click', open);
  img.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      show();
    }
  });
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  dialog.querySelector('.lightbox-close').onclick = () => dialog.close();
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();

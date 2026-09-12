(function () {
  'use strict';

  var STORAGE_KEY = 'sartoria_cookie_consent_v1';
  var GA_ID = 'G-YYXB1P6WK6';
  var analyticsLoaded = false;
  var lang = (document.documentElement.lang || 'it').toLowerCase();
  var code = lang.startsWith('de') ? 'de' : lang.startsWith('es') ? 'es' : lang.startsWith('pt') ? 'pt' : lang.startsWith('en') ? 'en' : 'it';
  var copy = {
    it: {title:'La tua privacy',text:'Utilizziamo cookie tecnici necessari e, solo con il tuo consenso, Google Analytics per comprendere come viene utilizzato il sito e migliorarlo.',more:'Leggi la Cookie Policy',accept:'Accetta',reject:'Rifiuta',custom:'Personalizza',settings:'Gestisci cookie',prefs:'Preferenze cookie',necessary:'Cookie tecnici necessari',always:'Sempre attivi',analytics:'Google Analytics',analyticsText:'Ci aiuta a misurare visite e utilizzo del sito. Si attiva soltanto con il tuo consenso.',save:'Salva preferenze',close:'Chiudi'},
    en: {title:'Your privacy',text:'We use necessary technical cookies and, only with your consent, Google Analytics to understand how the website is used and improve it.',more:'Read the Cookie Policy',accept:'Accept',reject:'Reject',custom:'Customise',settings:'Cookie settings',prefs:'Cookie preferences',necessary:'Necessary technical cookies',always:'Always active',analytics:'Google Analytics',analyticsText:'Helps us measure visits and website usage. It is enabled only with your consent.',save:'Save preferences',close:'Close'},
    de: {title:'Deine Privatsphäre',text:'Wir verwenden notwendige technische Cookies und nur mit deiner Einwilligung Google Analytics, um die Nutzung der Website zu verstehen und sie zu verbessern.',more:'Cookie-Richtlinie lesen',accept:'Akzeptieren',reject:'Ablehnen',custom:'Anpassen',settings:'Cookie-Einstellungen',prefs:'Cookie-Einstellungen',necessary:'Notwendige technische Cookies',always:'Immer aktiv',analytics:'Google Analytics',analyticsText:'Hilft uns, Besuche und die Nutzung der Website zu messen. Wird nur mit deiner Einwilligung aktiviert.',save:'Auswahl speichern',close:'Schließen'},
    es: {title:'Tu privacidad',text:'Utilizamos cookies técnicas necesarias y, solo con tu consentimiento, Google Analytics para comprender cómo se utiliza el sitio y mejorarlo.',more:'Leer la Política de Cookies',accept:'Aceptar',reject:'Rechazar',custom:'Personalizar',settings:'Gestionar cookies',prefs:'Preferencias de cookies',necessary:'Cookies técnicas necesarias',always:'Siempre activas',analytics:'Google Analytics',analyticsText:'Nos ayuda a medir las visitas y el uso del sitio. Se activa únicamente con tu consentimiento.',save:'Guardar preferencias',close:'Cerrar'},
    pt: {title:'A sua privacidade',text:'Utilizamos cookies técnicas necessárias e, apenas com o seu consentimento, Google Analytics para compreender a utilização do site e melhorá-lo.',more:'Ler a Política de Cookies',accept:'Aceitar',reject:'Recusar',custom:'Personalizar',settings:'Gerir cookies',prefs:'Preferências de cookies',necessary:'Cookies técnicas necessárias',always:'Sempre ativas',analytics:'Google Analytics',analyticsText:'Ajuda-nos a medir visitas e a utilização do site. Só é ativado com o seu consentimento.',save:'Guardar preferências',close:'Fechar'}
  }[code];

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {anonymize_ip:true});
  }

  function disableAnalytics() {
    window.gtag('consent', 'update', {analytics_storage:'denied'});
    window['ga-disable-' + GA_ID] = true;
    document.cookie = '_ga=; Max-Age=0; Path=/; SameSite=Lax';
    document.cookie = '_ga_' + GA_ID.replace('G-', '') + '=; Max-Age=0; Path=/; SameSite=Lax';
  }

  function storeChoice(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({analytics:value,updated:new Date().toISOString()}));
    value ? loadAnalytics() : disableAnalytics();
    closePanels();
  }

  function closePanels() {
    var banner = document.getElementById('cookie-consent-banner');
    var modal = document.getElementById('cookie-consent-modal');
    if (banner) banner.hidden = true;
    if (modal) modal.hidden = true;
    document.body.classList.remove('cookie-modal-open');
  }

  function openPreferences() {
    var modal = document.getElementById('cookie-consent-modal');
    var checkbox = document.getElementById('cookie-analytics-choice');
    var saved = readChoice();
    checkbox.checked = saved ? saved.analytics === true : false;
    modal.hidden = false;
    document.body.classList.add('cookie-modal-open');
    modal.querySelector('.cookie-dialog').focus();
  }

  function readChoice() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }

  function buildInterface() {
    var banner = document.createElement('section');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = '<div class="cookie-banner-copy"><h2 id="cookie-banner-title">' + copy.title + '</h2><p>' + copy.text + ' <a href="/cookie-policy/">' + copy.more + '</a>.</p></div><div class="cookie-actions"><button type="button" class="cookie-btn cookie-btn-secondary" data-cookie="reject">' + copy.reject + '</button><button type="button" class="cookie-btn cookie-btn-secondary" data-cookie="custom">' + copy.custom + '</button><button type="button" class="cookie-btn cookie-btn-primary" data-cookie="accept">' + copy.accept + '</button></div>';

    var modal = document.createElement('div');
    modal.id = 'cookie-consent-modal';
    modal.className = 'cookie-modal';
    modal.hidden = true;
    modal.innerHTML = '<div class="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title" tabindex="-1"><button type="button" class="cookie-close" aria-label="' + copy.close + '">×</button><h2 id="cookie-preferences-title">' + copy.prefs + '</h2><div class="cookie-option"><div><strong>' + copy.necessary + '</strong></div><span>' + copy.always + '</span></div><label class="cookie-option" for="cookie-analytics-choice"><div><strong>' + copy.analytics + '</strong><small>' + copy.analyticsText + '</small></div><input id="cookie-analytics-choice" type="checkbox"></label><div class="cookie-actions"><button type="button" class="cookie-btn cookie-btn-secondary" data-cookie="reject">' + copy.reject + '</button><button type="button" class="cookie-btn cookie-btn-primary" data-cookie="save">' + copy.save + '</button></div></div>';

    var settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'cookie-settings-button';
    settings.textContent = copy.settings;
    settings.addEventListener('click', openPreferences);
    document.body.appendChild(banner);
    document.body.appendChild(modal);
    document.body.appendChild(settings);

    document.addEventListener('click', function (event) {
      var action = event.target.closest('[data-cookie]');
      if (!action) return;
      if (action.dataset.cookie === 'accept') storeChoice(true);
      if (action.dataset.cookie === 'reject') storeChoice(false);
      if (action.dataset.cookie === 'custom') openPreferences();
      if (action.dataset.cookie === 'save') storeChoice(document.getElementById('cookie-analytics-choice').checked);
    });
    modal.querySelector('.cookie-close').addEventListener('click', closePanels);
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildInterface();
    var saved = readChoice();
    if (!saved) document.getElementById('cookie-consent-banner').hidden = false;
    else if (saved.analytics === true) loadAnalytics();
    else disableAnalytics();
  });
}());

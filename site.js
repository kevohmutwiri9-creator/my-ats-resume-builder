(function(){
  function $(sel){return document.querySelector(sel);}

  var y=document.getElementById('year');
  if(y){y.textContent=String(new Date().getFullYear());}

  function pathFor(asset){
    var p=String(location.pathname||'');
    if(p.indexOf('/guides/')!==-1){return '../'+asset;}
    return './'+asset;
  }

  function ensureFavicon(){
    var existing=document.querySelector('link[rel="icon"],link[rel="shortcut icon"]');
    if(existing) return;
    var link=document.createElement('link');
    link.rel='icon';
    link.href=pathFor('favicon.svg');
    document.head.appendChild(link);
  }

  function ensureAdsenseMeta(){
    if(document.querySelector('meta[name="google-adsense-account"]')) return;
    var cfg=window.ADSENSE_CONFIG;
    if(!cfg || !cfg.publisherId) return;
    var meta=document.createElement('meta');
    meta.name='google-adsense-account';
    meta.content=cfg.publisherId;
    document.head.appendChild(meta);
  }

  var CONSENT_KEY='site_consent_v1';
  function getConsent(){
    try{
      var v=localStorage.getItem(CONSENT_KEY);
      if(!v) return null;
      return JSON.parse(v);
    }catch{return null;}
  }

  function setConsent(value){
    try{localStorage.setItem(CONSENT_KEY, JSON.stringify(value));}catch{}
  }

  function showConsentBanner(){
    if(document.getElementById('consentBanner')) return;
    var wrap=document.createElement('div');
    wrap.className='consent';
    wrap.id='consentBanner';
    wrap.innerHTML =
      '<div class="consent-inner">'
      + '<div>'
      + '<div class="consent-title">Cookies & ads</div>'
      + '<div class="muted tiny">We use cookies for basic functionality and may load Google AdSense after consent. See <a href="'+pathFor('privacy.html')+'">Privacy</a>.</div>'
      + '</div>'
      + '<div class="consent-actions">'
      + '<button class="btn btn-ghost" type="button" id="consentReject">Reject</button>'
      + '<button class="btn btn-primary" type="button" id="consentAccept">Accept</button>'
      + '</div>'
      + '</div>';

    document.body.appendChild(wrap);
    wrap.style.display='block';

    document.getElementById('consentReject').addEventListener('click', function(){
      setConsent({ ads: false, ts: Date.now() });
      wrap.remove();
    });
    document.getElementById('consentAccept').addEventListener('click', function(){
      setConsent({ ads: true, ts: Date.now() });
      wrap.remove();
      tryLoadAdsense();
    });
  }

  function loadScript(src, onload){
    var s=document.createElement('script');
    s.src=src;
    s.async=true;
    s.crossOrigin='anonymous';
    s.onload=function(){ if(onload) onload(); };
    s.onerror=function(){ if(onload) onload(new Error('failed')); };
    document.head.appendChild(s);
  }

  function tryLoadAdsense(){
    var consent=getConsent();
    if(!consent || !consent.ads) return;

    function start(){
      var cfg=window.ADSENSE_CONFIG || { enabled:false };
      if(!cfg.enabled) return;
      if(!cfg.publisherId) return;

      if(window.__ADSENSE_LOADED__) return;
      window.__ADSENSE_LOADED__=true;

      var qs='client='+encodeURIComponent(cfg.publisherId);
      loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?'+qs, function(){
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      });

      document.querySelectorAll('.ad-box').forEach(function(el){
        el.textContent='Ads enabled';
      });
    }

    if(window.ADSENSE_CONFIG){
      ensureAdsenseMeta();
      start();
      return;
    }

    loadScript(pathFor('adsense-config.js'), function(){
      ensureAdsenseMeta();
      start();
    });
  }

  ensureFavicon();

  if(window.ADSENSE_CONFIG){
    ensureAdsenseMeta();
  } else {
    loadScript(pathFor('adsense-config.js'), function(){
      ensureAdsenseMeta();
    });
  }

  var consent=getConsent();
  if(!consent){
    showConsentBanner();
  } else {
    tryLoadAdsense();
  }
})();

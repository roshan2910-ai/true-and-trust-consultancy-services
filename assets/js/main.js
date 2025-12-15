(function(){
  'use strict';
  if (typeof window.BUSINESS_WHATSAPP === 'undefined') window.BUSINESS_WHATSAPP = '';
  if (typeof window.RAZORPAY_KEY === 'undefined') window.RAZORPAY_KEY = '';

  async function loadParts(){
    try {
      const [h,f] = await Promise.all([
        fetch('/components/header.html').then(r=>r.text()).catch(()=>null),
        fetch('/components/footer.html').then(r=>r.text()).catch(()=>null)
      ]);
      if (h) document.getElementById('site-header').innerHTML = h;
      if (f) document.getElementById('site-footer').innerHTML = f;
      const wa = document.getElementById('waFloat');
      if (wa && window.BUSINESS_WHATSAPP) wa.href = `https://wa.me/${window.BUSINESS_WHATSAPP}`;
    } catch(err){ console.warn(err) }
  }

  window.openWhatsApp = function(service, pkg){
    const phone = (window.BUSINESS_WHATSAPP||'').toString().replace(/\D/g,'');
    const name = localStorage.getItem('ttcs_name')||'';
    const txt = `Hello True and Trust Consultancy Services.%0AService: ${service || ''}%0APackage: ${pkg || ''}%0AName: ${name}%0AMessage: I want to enquire.`;
    if (!phone) { window.location.href='/contact.html'; return; }
    window.open(`https://wa.me/${phone}?text=${txt}`,'_blank');
  };

  function wireActions(){
    document.querySelectorAll('[data-buy]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const el = e.currentTarget;
        const service = el.getAttribute('data-service') || '';
        const pack = el.getAttribute('data-package') || '';
        const pay = (el.getAttribute('data-pay')||'').toLowerCase();
        const amount = Number(el.getAttribute('data-amount')||0);
        if (pay === 'online' && typeof window.startPayment === 'function'){
          window.startPayment(amount, service, pack);
        } else {
          window.openWhatsApp(service, pack);
        }
      });
    });
    const cf = document.getElementById('contactForm');
    if (cf) cf.addEventListener('submit', e=>{
      e.preventDefault();
      alert('Contact submitted — implement /api/contact to store leads.');
      cf.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    loadParts().then(()=>setTimeout(wireActions,150));
  });
})();
// ===== Expert Bhai Logic + WhatsApp Auto Message =====
(function(){
  const toggle=document.querySelector('.expert-toggle');
  const box=document.querySelector('.expert-box');
  if(toggle && box){
    toggle.onclick=()=> box.style.display = box.style.display==='block'?'none':'block';
  }
  const phone='91XXXXXXXXXX';
  document.querySelectorAll('.eb-link').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const service=a.dataset.service||'General Enquiry';
      const msg=encodeURIComponent('Hello Expert Bhai, I need help with '+service+'.');
      window.open('https://wa.me/'+phone+'?text='+msg,'_blank');
    });
  });
})();

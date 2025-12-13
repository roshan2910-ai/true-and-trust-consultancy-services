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

 <script>
document.addEventListener('DOMContentLoaded', function () {
  const slidesEl = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const nextBtn = document.querySelector('.slider-next');
  const prevBtn = document.querySelector('.slider-prev');
  const dotsContainer = document.querySelector('.dots');

  if (!slidesEl || slides.length === 0) return;

  let idx = 0;
  const total = slides.length;
  let interval = null;
  const AUTO_DELAY = 5000;

  // create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.dataset.index = i;
    if (i === 0) btn.classList.add('active');
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.children);

  function goTo(n) {
    idx = ((n % total) + total) % total;
    slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
  }

  function next() { goTo(idx + 1); }
  function prev() { goTo(idx - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  dots.forEach(d => d.addEventListener('click', e => {
    goTo(parseInt(e.target.dataset.index, 10)); resetAuto();
  }));

  // auto play
  function startAuto() {
    interval = setInterval(next, AUTO_DELAY);
  }
  function stopAuto() { clearInterval(interval); interval = null; }
  function resetAuto() { stopAuto(); startAuto(); }

  // pause on hover
  const wrapper = document.querySelector('.slider-wrapper');
  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);

  // start
  goTo(0);
  startAuto();
});
</script>

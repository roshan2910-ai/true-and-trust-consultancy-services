(function(){
  'use strict';
  const RAZORPAY_KEY = (window.RAZORPAY_KEY || '').toString();

  async function createOrder(amountRupees, notes = {}){
    const resp = await fetch('/api/create-order', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amountRupees,currency:'INR',receipt:`rcpt_${Date.now()}`,notes})});
    if (!resp.ok) throw new Error('Order create failed');
    return await resp.json();
  }

  async function verifyPayment(payload){
    return fetch('/api/verify-payment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }

  async function startPayment(amountRupees=0, serviceName='', packageName=''){
    if (!amountRupees) return alert('Invalid amount');
    try {
      const order = await createOrder(amountRupees,{service:serviceName,package:packageName});
      const options = {
        key: RAZORPAY_KEY || '',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'True and Trust Consultancy Services',
        description: `${serviceName} - ${packageName}`,
        order_id: order.id,
        handler: async function(response){
          const resp = await verifyPayment(response);
          if (resp.ok) {
            const admin = (window.BUSINESS_WHATSAPP||'').toString().replace(/\D/g,'');
            if (admin) window.open(`https://wa.me/${admin}?text=${encodeURIComponent('Payment received: '+response.razorpay_payment_id)}`,'_blank');
            window.location.href = '/contact.html?status=success';
          } else {
            alert('Verification failed');
          }
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch(err){
      console.error(err);
      alert('Payment error: '+err.message);
    }
  }

  window.startPayment = startPayment;
})();
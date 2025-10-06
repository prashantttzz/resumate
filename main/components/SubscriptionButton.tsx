'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Component from './premium-activation-popup';
import confetti from 'canvas-confetti';

export default function PremiumButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Confetti animation
  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return setShowPopup(true);

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle premium subscribe
  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch('/api/create-subscription', {
      method: 'POST',
    });

    const { subscriptionId, user } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      name: 'Resumate Pro',
      description: 'Monthly Premium Access',
      subscription_id: subscriptionId,
      handler: async function (response: any) {
        toast.success('Payment successful! Activating premium...');
        setLoading(false);
        triggerConfetti(); // ✅ Call the confetti function
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: '#6366F1',
      },
    };

    // @ts-ignore
    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`px-4 py-2 rounded-xl transition ${
          loading ? 'opacity-50 cursor-not-allowed' : 'text-black'
        }`}
      >
        {loading ? 'Processing...' : 'Go Premium ₹100/month'}
      </button>

      {showPopup && <Component isOpen={true} onClose={() => setShowPopup(false)} />}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import './coming-soon.css';
import Image from 'next/image';

import facebookIcon from '../../public/facebook.png';
import instagramIcon from '../../public/instagram.png';
import twitterIcon from '../../public/x.png';
import linkedinIcon from '../../public/linkedin.png';
import logo from '../../public/logo.png';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNotify = () => {
    if (loading || submitted) return;

    if (!isValidEmail(email)) {
      setToast('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setToast('✓ You’re on the list!');
    }, 1500);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000); // Hide toast after 3s
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className='coming-soon'>
      <div className="container">
        <div className="top-di"></div>
        <div className="top-sec">
          <Image src={logo} alt='Prompt Suite Logo' className='logo' />
          <h1>Coming Soon</h1>
          <p>Get ready everyone! We are currently working on something awesome.</p>

          <div className="newsletter">
            <input
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
            />
            <button onClick={handleNotify} disabled={submitted || loading}>
              {loading ? 'Sending...' : submitted ? '✓ Sent!' : 'Notify Me'}
            </button>
          </div>
        </div>

        <div className="bottom-sec">
          <span className='line'></span>
          <div className="social-icons">
            <div className="icons">
              <a href="https://www.facebook.com/profile.php?id=61576910941472" className='icon-link'>
                <Image src={facebookIcon} alt='' className='icon-img' />
                <span className='icon-text'> Facebook</span>
              </a>
            </div>
            <div className="icons">
              <a href="https://www.instagram.com/promptsuite.dev/" className='icon-link'>
                <Image src={instagramIcon} alt='' className='icon-img' />
                <span className='icon-text'> Instagram</span>
              </a>
            </div>
            <div className="icons">
              <a href="https://x.com/promptsuite" className='icon-link'>
                <Image src={twitterIcon} alt='' className='icon-img' />
                <span className='icon-text'> TwitterX</span>
              </a>
            </div>
            <div className="icons">
              <a href="https://www.linkedin.com/in/promptsuite-technologies-36596a36a/" className='icon-link'>
                <Image src={linkedinIcon} alt='' className='icon-img linkedin' />
                <span className='icon-text'> LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

import './coming-soon.css';
import Image from 'next/image';

import facebookIcon from '../../public/facebook.png';
import instagramIcon from '../../public/instagram.png';
import twitterIcon from '../../public/x.png';
import linkedinIcon from '../../public/linkedin.png';
import logo from '../../public/logo.png';

export default function Home() {
  return (
    <div className='coming-soon'>
      <div className="container">
        <div className="top-di"></div>
        <div className="top-sec">
          <Image src={logo} alt='Prompt Suite Logo' className='logo' />
          <h1>Coming Soon</h1>
          <p>Get ready everyone! We are currently working on something awesome.</p>

          <div className="newsletter">
            <input type="email" placeholder='Enter your email' />
            <button>Notify Me</button>
          </div>
        </div>
        <div className="bottom-sec">
          <span className='line'></span>
          <div className="social-icons">
            <div className="icons">
              <a href="facebook" className='icon-link'>
                <Image src={facebookIcon} alt='' className='icon-img' />
                <span className='icon-text'> Facebook</span>
              </a>
            </div>
            <div className="icons">
              <a href="facebook" className='icon-link'>
                <Image src={instagramIcon} alt='' className='icon-img' />
                <span className='icon-text'> Instagram</span>
              </a>
            </div>
            <div className="icons">
              <a href="facebook" className='icon-link'>
                <Image src={twitterIcon} alt='' className='icon-img' />
                <span className='icon-text'> TwitterX</span>
              </a>
            </div>
            <div className="icons">
              <a href="facebook" className='icon-link'>
                <Image src={linkedinIcon} alt='' className='icon-img linkedin' />
                <span className='icon-text'> LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

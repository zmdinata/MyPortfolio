import { useLang } from '../../context/LangContext';
import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

export default function Footer() {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();
  const rawCopyright = t('footer.copyright') || `© ${currentYear} Zacky Muhammad Dinata. All rights reserved.`;
  const copyrightText = rawCopyright.replace(/\b20\d\d\b/, currentYear);

  return (
    <footer className="footer">
      <div className="footer-socials">
        <a href="https://www.instagram.com/zmdinataaa" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/in/zacky-muhammad-dinata-463995280" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>
        <a href="https://github.com/zmdinata" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="mailto:zmdinata@gmail.com" className="footer-social-link" aria-label="Email">
          <HiOutlineMail />
        </a>
      </div>
      <p>{copyrightText}</p>
    </footer>
  );
}

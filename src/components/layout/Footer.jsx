import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/products?badges=new' },
    { name: 'Ready to Wear', href: '/products?subcategory=ready-to-wear' },
    { name: 'Couture', href: '/products?subcategory=couture' },
    { name: 'Menswear', href: '/products?subcategory=menswear' },
    { name: 'Accessories', href: '/products?subcategory=accessories' },
  ],
  help: [
    { name: 'Contact Us', href: '#' },
    { name: 'Shipping & Returns', href: '#' },
    { name: 'Size Guide', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Track Order', href: '#' },
  ],
  about: [
    { name: 'Our Story', href: '#' },
    { name: 'Craftsmanship', href: '#' },
    { name: 'Stores', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ]
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-[0.15em]">
              KAVYAAR
            </Link>
            <p className="mt-4 text-sm text-red-100 leading-relaxed max-w-sm">
              Contemporary luxury house crafting elevated silhouettes and essentials with meticulous attention to detail.
            </p>
            <div className="flex gap-3 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 border border-red-300/30 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-red-300/30 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-red-300/30 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-red-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase mb-6">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-red-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase mb-6">Contact</h4>
            <div className="space-y-4 text-sm">
              <p className="text-red-100">
                <span className="text-xs uppercase tracking-wide text-red-200/60 block mb-1">WhatsApp</span>
                +92 300 1234567
              </p>
              <p className="text-red-100">
                <span className="text-xs uppercase tracking-wide text-red-200/60 block mb-1">Email</span>
                hello@kavyaar.com
              </p>
              <p className="text-red-100">
                <span className="text-xs uppercase tracking-wide text-red-200/60 block mb-1">Hours</span>
                Mon - Sat: 10am - 8pm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-red-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-red-200/60">
            &copy; 2025 KAVYAAR. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-sm text-red-200/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-red-200/60 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

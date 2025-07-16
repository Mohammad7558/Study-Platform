import React from 'react'
import { Link } from 'react-router'
import { 
  GitHubLogoIcon, 
  TwitterLogoIcon,
  EnvelopeClosedIcon, 
} from "@radix-ui/react-icons"
import { PhoneIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-8 mx-auto">
        
        {/* Main Footer Grid - Stack on mobile, 2 columns on small, 4 on large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">MyWebsite</h3>
            <p className="text-sm text-muted-foreground">
              Building the next generation of web experiences
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <TwitterLogoIcon className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <GitHubLogoIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <EnvelopeClosedIcon className="h-4 w-4" />
                <a href="mailto:hello@mywebsite.com" className="hover:text-foreground transition-colors">
                  hello@mywebsite.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-foreground transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} MyWebsite, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
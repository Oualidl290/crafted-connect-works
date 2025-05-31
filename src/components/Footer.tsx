
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-orange-400">
              Crafted
            </h3>
            <p className="text-stone-400 leading-relaxed mb-6">
              Making skilled work human again. Connect with trusted local professionals or showcase your craft to the community.
            </p>
            <div className="flex gap-4">
              <Button size="sm" variant="outline" className="border-stone-600 text-stone-300 hover:text-white hover:border-orange-400 rounded-xl">
                Twitter
              </Button>
              <Button size="sm" variant="outline" className="border-stone-600 text-stone-300 hover:text-white hover:border-orange-400 rounded-xl">
                LinkedIn
              </Button>
            </div>
          </div>
          
          {/* For Clients */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">For Clients</h4>
            <ul className="space-y-3 text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Find Professionals</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Browse Categories</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Safety & Trust</a></li>
            </ul>
          </div>
          
          {/* For Pros */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">For Professionals</h4>
            <ul className="space-y-3 text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Become a Pro</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Pro Dashboard</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Pro Resources</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-stone-500 text-sm">
          <p>&copy; 2024 Crafted. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
          </div>
        </div>
        
        {/* Mission statement */}
        <div className="mt-8 text-center">
          <p className="text-stone-400 italic max-w-3xl mx-auto leading-relaxed">
            "We believe in the dignity of work — especially the kind done with care, precision, and pride. 
            Our mission is to connect everyday people with the craftsmen and craftswomen who keep our homes, spaces, and lives running."
          </p>
        </div>
      </div>
    </footer>
  );
};

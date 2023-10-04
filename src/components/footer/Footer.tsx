import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-white p-6 mt-16 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-bold mb-2">ABOUT</h3>
            <ul className="space-y-1">
              <li>Frequently Asked Questions</li>
              <li>About Cecep Januardi</li>
              <li>Community Standards</li>
              <li>Organizational Structure</li>
              <li>Security Status</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">GET INVOLVED</h3>
            <ul className="space-y-1">
              <li><a href="https://github.com/cecep31" target="_blank" className="hover:underline">Contribute</a></li>
              <li>Submit Bugs</li>
              <li>Donate</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">DOCUMENTATION</h3>
            <ul className="space-y-1">
              <li>Guidelines</li>
              <li><a href="https://wiki.pilput.dev" className="hover:underline">Wiki</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">LEGAL</h3>
            <ul className="space-y-1">
              <li>Licensing</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Language selector and copyright */}
        <div className="mt-6 flex justify-center items-center">
          {/* Copyright */}
          <p>© 2023 pilput. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

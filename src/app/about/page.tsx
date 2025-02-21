import React from 'react'
import Hero from '@/components/landing/Hero'
import Navigation from '@/components/header/Navbar';
import Footer from '@/components/footer/Footer';
import Social from '@/components/landing/Social';

function page() {
  return (
<div>
    <Navigation />
    <Hero />
    <Social />
    <Footer />
</div>
    
  )
}

export default page
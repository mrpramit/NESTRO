import React from 'react'
import Link from 'next/link'
import Hero from '@/components/common/Hero'
import Categories from '@/components/website/Categories'
import BestSellers from '@/components/website/BestSellers'
import JustLanded from '@/components/website/JustLanded'
import Features from '@/components/website/Features'
import Testimonials from '@/components/website/Testimonials'
import NewsletterBanner from '@/components/website/NewsletterBanner'

export default function page() {
  return (
    <main className="bg-[#FAF7F2] pb-12 flex-grow">
      <Hero
        tag="Summer Collection 2026"
        title={
          <>
            Where Comfort <br /> Meets <span className="italic font-serif text-[#C4A484] font-normal">Craft</span>
          </>
        }
        description="Scandinavian-inspired furniture for modern living. Curated pieces that endure seasons."
        buttons={
          <>
            <Link
              href="/store"
              className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 font-semibold px-6 py-3 rounded text-sm md:text-base flex items-center gap-2 group/btn hover:scale-[1.03] hover:shadow-lg hover:shadow-[#8C6239]/25"
            >
              Shop Collection 
              <span className="transform group-hover/btn:translate-x-2 transition-transform duration-200">→</span>
            </Link>
            <Link
              href="/lookbook"
              className="border border-[#FAF7F2]/30 hover:border-[#FAF7F2] text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#281C19] transition-all duration-300 font-semibold px-6 py-3 rounded text-sm md:text-base hover:scale-[1.03] hover:shadow-lg"
            >
              View Lookbook
            </Link>
          </>
        }
        image="/sofa.png"
      />
      <Categories />
      <BestSellers />
      <JustLanded />
      <Features />
      <Testimonials />
      <NewsletterBanner />
    </main>
  )
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  Award,
  ArrowRight,
  ChevronDown,
  Building,
  Home,
  Check,
  Send,
  Instagram,
  Youtube,
  Facebook,
  Video,
  Globe,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_LOGO_URL } from "@/lib/branding";
import { fetchCompany, parseLandingConfig, DEFAULT_LANDING_CONFIG } from "@/lib/crm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Famtima Traders | Home Decoration, POP False Ceiling & PVC Wall Panelling | Bemetara, Chhattisgarh",
      },
      {
        name: "description",
        content:
          "Top-rated home decoration, POP false ceiling design, PVC wall panelling & turnkey renovation contractor in Bemetara, Durg, Bhilai, Raipur, Kawardha & Chhattisgarh. 15+ years international craftsmanship by Anwar Khan. Free site measurement & quotation: +91 7860854662.",
      },
      {
        name: "keywords",
        content:
          "famtima traders, famtima traders bemetara, pop work bemetara, pop false ceiling bemetara, pvc wall panelling bemetara, home decoration bemetara, false ceiling chhattisgarh, pop contractor bemetara, pvc ceiling contractor chhattisgarh, interior designer bemetara, pop design bemetara, pvc wall panel shop bemetara, gypsum false ceiling durg bhilai, home interior raipur chhattisgarh, false ceiling contractor raipur, pop ceiling rate per sq ft chhattisgarh, wall panelling kawardha, turnkey renovation bemetara, krishna vihar bemetara, anwar khan pop contractor, bemetara me pop ka kaam, false ceiling design 2026, fluted pvc louver panels bemetara, living room pop design chhattisgarh",
      },
      { property: "og:site_name", content: "Famtima Traders" },
      {
        property: "og:title",
        content:
          "Famtima Traders | POP False Ceiling, PVC Wall Panelling & Home Decoration in Bemetara, CG",
      },
      {
        property: "og:description",
        content:
          "Bemetara's #1 POP false ceiling, PVC wall panelling & home decoration contractor. Serving Bemetara, Durg, Bhilai, Raipur & across Chhattisgarh. Call Anwar Khan at +91 7860854662.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://famtima-traders.vercel.app/" },
      { property: "og:image", content: "/famtima-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Famtima Traders | Home Decoration & False Ceiling Bemetara CG",
      },
      {
        name: "twitter:description",
        content:
          "Premier home decoration, POP false ceiling & PVC wall panelling in Bemetara & Chhattisgarh. Call +91 7860854662.",
      },
      { name: "twitter:image", content: "/famtima-logo.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "ProfessionalService"],
          "@id": "https://famtima-traders.vercel.app/#business",
          name: "Famtima Traders",
          alternateName: [
            "Famtima Traders Bemetara",
            "Famtima Home Decoration",
            "Bemetara POP Work & PVC Panelling",
          ],
          url: "https://famtima-traders.vercel.app/",
          logo: "https://famtima-traders.vercel.app/famtima-logo.png",
          image: "https://famtima-traders.vercel.app/famtima-logo.png",
          description:
            "Premier home decoration, POP false ceiling, PVC wall panelling, and renovation contractor based in Bemetara, Chhattisgarh. Offering customized home decoration and turnkey renovation solutions.",
          telephone: "+91-7860854662",
          email: "anwaarrza850@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Shop No. 08, Krishna Vihar",
            addressLocality: "Bemetara",
            addressRegion: "Chhattisgarh",
            postalCode: "491335",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 21.7018,
            longitude: 81.5478,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "09:00",
              closes: "20:00",
            },
          ],
          priceRange: "₹₹",
          knowsAbout: [
            "POP False Ceiling Design",
            "Plaster of Paris Work",
            "PVC Wall Panelling",
            "PVC Ceiling Panels",
            "Gypsum Board False Ceiling",
            "Fluted Wall Louvers",
            "Living Room Ceiling Design",
            "Home Decoration & Interior Renovation",
            "Cornice & Molding Design",
            "Commercial Grid Ceiling",
          ],
          areaServed: [
            { "@type": "City", name: "Bemetara" },
            { "@type": "AdministrativeArea", name: "Krishna Vihar, Bemetara" },
            { "@type": "AdministrativeArea", name: "Berla, Bemetara" },
            { "@type": "AdministrativeArea", name: "Saja, Bemetara" },
            { "@type": "AdministrativeArea", name: "Nawagarh, Bemetara" },
            { "@type": "City", name: "Durg" },
            { "@type": "City", name: "Bhilai" },
            { "@type": "City", name: "Raipur" },
            { "@type": "City", name: "Bilaspur" },
            { "@type": "City", name: "Rajnandgaon" },
            { "@type": "City", name: "Kawardha" },
            { "@type": "City", name: "Simga" },
            { "@type": "AdministrativeArea", name: "Chhattisgarh" },
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Home Decoration & Renovation Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Home Decoration",
                  description:
                    "Complete home styling, modern aesthetic ceilings and wall decor in Bemetara.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "POP Work / False Ceiling",
                  description:
                    "Plaster of Paris false ceiling with designer LED cove channels in Bemetara and Chhattisgarh.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "PVC Wall Panelling",
                  description:
                    "100% waterproof and termite-proof decorative PVC wall panels and fluted louvers.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Renovation & Remodelling",
                  description: "Turnkey home and commercial space renovation across Chhattisgarh.",
                },
              },
            ],
          },
        }),
      },
    ],
  }),
  component: PublicLandingPage,
});

function PublicLandingPage() {
  const [lang, setLang] = useState<"en" | "hi">("hi");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("POP False Ceiling");
  const [propertyType, setPropertyType] = useState("2BHK Flat");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: company } = useQuery({ queryKey: ["company"], queryFn: fetchCompany });
  const landingConfig = parseLandingConfig(company?.website);
  const companyLogoUrl =
    company?.logo_url && !company.logo_url.startsWith("data:image")
      ? company.logo_url
      : DEFAULT_LOGO_URL;

  const phonePrimary = company?.mobile1 || "7860854662";
  const phoneSecondary = company?.mobile2 || "9265012186";

  const t = {
    topBanner:
      lang === "hi"
        ? "बेमेतरा व छत्तीसगढ़ • तुरंत कोटेशन व साइट विज़िट के लिए कॉल करें"
        : "Serving Bemetara & Chhattisgarh • Call for Free Site Visit & Quote",
    staffLogin: lang === "hi" ? "स्टाफ लॉगिन" : "Staff Login",
    navFounder: lang === "hi" ? "संस्थापक अनुभव" : "Founder Experience",
    founderBadge:
      lang === "hi"
        ? "15+ वर्ष अंतरराष्ट्रीय अनुभव — सऊदी अरब, दुबई, कतर व भारत"
        : "15+ Years International Experience — Saudi Arabia, Dubai, Qatar & India",
    founderTitle:
      lang === "hi"
        ? "संस्थापक और मुख्य शिल्पकार: अनवर खान"
        : "Meet the Founder: Anwar Khan",
    founderDesc:
      lang === "hi"
        ? "सऊदी अरब (SACODECO), कतर और दुबई के बड़े प्रोजेक्ट्स में 15+ वर्षों के व्यावहारिक अनुभव के साथ — अब विश्वस्तरीय फिनिशिंग और ईमानदारी आपके अपने बेमेतरा में।"
        : "With 15+ years of verified craftsmanship across Saudi Arabia, Qatar, Dubai (UAE) and India, Anwar Khan delivers high-precision POP false ceiling, PVC panelling and turnkey decoration directly to your doorstep.",
    founderRole:
      lang === "hi"
        ? "संस्थापक एवं मुख्य इंटीरियर शिल्पकार"
        : "Founder & Lead Interior Specialist",
    statYears: lang === "hi" ? "वर्ष अनुभव" : "Years Exp",
    statCountries: lang === "hi" ? "देशों का कार्य" : "Countries",
    statSupervision: lang === "hi" ? "सीधा पर्यवेक्षण" : "On-Site Check",
    internationalFootprint:
      lang === "hi"
        ? "वैश्विक कार्य अनुभव (GCC & भारत)"
        : "International Project Footprint",
    founderQuote:
      lang === "hi"
        ? "“सऊदी अरब और गल्फ के कड़े मानकों पर वर्षों काम करने के बाद, मैंने बेमेतरा में फातिमा ट्रेडर्स की स्थापना की ताकि हमारे परिवारों को बिना किसी बिचौलिए के वही अंतरराष्ट्रीय स्तर की फिनिशिंग, टिकाऊ सामग्री और सही दाम मिलें।”"
        : "“Having executed high-precision architectural carpentry & interior projects in Saudi Arabia and the Gulf, I founded Famtima Traders to bring that exact international standard, honesty, and lasting durability directly to homes across Bemetara at fair local rates.”",
    founderChatBtn: lang === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp",
    certVerified:
      lang === "hi"
        ? "प्रमाणित अंतरराष्ट्रीय कार्य अनुभव (सऊदी अरब)"
        : "Documented International Experience (Saudi Arabia)",
    pillar1Title:
      lang === "hi"
        ? "गल्फ-ग्रेड फिनिशिंग मानक"
        : "Gulf-Grade Quality Standards",
    pillar1Desc:
      lang === "hi"
        ? "लेज़र-लेवल संरेखण, सीमलेस जॉइंट्स और मजबूत फ्रेमिंग जो वर्षों तक नई जैसी बनी रहती है।"
        : "Laser-aligned false ceilings, seamless jointing and premium grade framing tested for long-lasting stability.",
    pillar2Title:
      lang === "hi"
        ? "सीधे कारीगर का काम (नो बिचौलिया)"
        : "Direct Craftsman Execution",
    pillar2Desc:
      lang === "hi"
        ? "कोई एजेंट या कमीशन नहीं। आप सीधे अनवर खान और उनकी कुशल टीम से काम करवाते हैं।"
        : "No middleman contractor margins. You deal directly with the master craftsman team.",
    pillar3Title:
      lang === "hi"
        ? "समय पर काम पूरा (ऑन-टाइम हैंडओवर)"
        : "Strict On-Time Delivery",
    pillar3Desc:
      lang === "hi"
        ? "अंतरराष्ट्रीय वर्क एथिक्स — तय तारीख पर साफ-सुथरा काम सौंपने की गारंटी।"
        : "International work ethics with pre-agreed timelines and spotless site cleanup after handover.",
    pillar4Title:
      lang === "hi"
        ? "100% वाटरप्रूफ व दीमक-रहित सामग्री"
        : "Durable & Termite-Proof Materials",
    pillar4Desc:
      lang === "hi"
        ? "छत्तीसगढ़ के मौसम के अनुकूल उच्च गुणवत्ता वाले PVC, WPC और POP उत्पादों का चयन।"
        : "High-grade moisture-resistant PVC, WPC and premium plaster chosen specifically for local climate.",
    navServices: lang === "hi" ? "सेवाएं" : "Services",
    navPop: lang === "hi" ? "POP सीलिंग" : "POP Ceilings",
    navPvc: lang === "hi" ? "PVC पैनल्स" : "PVC Panels",
    navGallery: lang === "hi" ? "गैलरी" : "Work Gallery",
    navAreas: lang === "hi" ? "सेवा क्षेत्र" : "Service Areas",
    navQuote: lang === "hi" ? "कोटेशन" : "Get a Quote",
    navFaqs: lang === "hi" ? "सवाल-जवाब" : "FAQs",
    tagline:
      lang === "hi"
        ? "होम डेकोरेशन और रेनोवेशन एक्सपर्ट्स"
        : "Home Decoration & Renovation Experts",
    badge:
      lang === "hi"
        ? "बेमेतरा के विश्वसनीय होम डेकोर व सीलिंग एक्सपर्ट्स"
        : "Trusted Home Decor & Ceiling Experts in Bemetara",
    heroTitle1: lang === "hi" ? "सर्वश्रेष्ठ" : "Premium",
    heroTitlePop: lang === "hi" ? "होम डेकोरेशन" : "Home Decoration",
    heroTitleAnd: lang === "hi" ? "&" : "&",
    heroTitlePvc: lang === "hi" ? "फॉल्स सीलिंग" : "False Ceiling",
    heroTitleCity: lang === "hi" ? "बेमेतरा में" : "in Bemetara",
    heroDesc:
      lang === "hi"
        ? "प्रीमियम POP फॉल्स सीलिंग, 100% वॉटरप्रूफ PVC वॉल पैनल्स और मॉडर्न होम डेकोरेशन। सीधे मास्टर कारीगरों द्वारा उच्च गुणवत्ता और वाजिब दरों पर कार्य।"
        : "Designer POP false ceilings, 100% waterproof PVC wall panels, and turnkey home decor. Direct craftsman rates with premium finishing across Bemetara & Chhattisgarh.",
    statExp: lang === "hi" ? "प्रीमियम" : "Premium",
    statExpSub: lang === "hi" ? "फिनिशिंग" : "Finishing",
    statProj: lang === "hi" ? "100%" : "100%",
    statProjSub: lang === "hi" ? "वॉटरप्रूफ PVC" : "Waterproof PVC",
    statWaterproof: lang === "hi" ? "किफायती" : "Direct Rates",
    statWaterproofSub: lang === "hi" ? "कारीगर दरें" : "No Middlemen",
    statRating: lang === "hi" ? "भरोसेमंद" : "Trusted",
    statRatingSub: lang === "hi" ? "लोकल एक्सपर्ट" : "Local Expert",
    btnFreeEstimate: lang === "hi" ? "मुफ्त कोटेशन पाएं" : "Get Free Quote",
    btnCall: lang === "hi" ? "कॉल करें" : "Call Now",
    trustLine:
      lang === "hi"
        ? "सीधे कारीगर • पारदर्शी दरें • समय पर डिलीवरी"
        : "Direct Craftsmen • Transparent Pricing • On-Time Handover",
    featuredBadge: lang === "hi" ? "फातिमा ट्रेडर्स" : "Famtima Project",
    featuredCompleted: lang === "hi" ? "पूर्ण" : "Completed",
    servicesSub:
      lang === "hi"
        ? "हमारी सेवाएं"
        : "What We Do",
    servicesTitle:
      lang === "hi"
        ? "इंटीरियर और सीलिंग समाधान"
        : "Interior & Ceiling Solutions",
    servicesDesc:
      lang === "hi"
        ? "सुंदर और टिकाऊ इंटीरियर के लिए हमारे प्रमुख कार्य।"
        : "High-quality, durable interior solutions tailored for modern spaces.",
    btnBookVisit: lang === "hi" ? "विज़िट बुक करें" : "Book Visit",
    gallerySub: lang === "hi" ? "पोर्टफोलियो" : "Portfolio",
    galleryTitle: lang === "hi" ? "हालिया कार्य" : "Recent Work",
    galleryBtn:
      lang === "hi"
        ? "व्हाट्सएप पर फोटो देखें"
        : "View Photo Catalog on WhatsApp",
    btnWatchClip: lang === "hi" ? "वीडियो" : "Video",
    btnSimilarQuote: lang === "hi" ? "ऐसा ही कोटेशन लें" : "Get Similar Quote",
    quoteSub: lang === "hi" ? "तुरंत एस्टीमेट" : "Instant Estimate",
    quoteTitle:
      lang === "hi"
        ? "अपने स्पेस के लिए तुरंत कोटेशन पाएं"
        : "Get an Instant Free Quote",
    quoteDesc:
      lang === "hi"
        ? "अपनी जरूरत बताएं और सीधे व्हाट्सएप पर तुरंत कोटेशन व परामर्श पाएं।"
        : "Share your requirements for an instant WhatsApp estimate and site consultation.",
    quoteF1Title: lang === "hi" ? "फ्री साइट विज़िट" : "Free Site Consultation",
    quoteF1Desc:
      lang === "hi"
        ? "घर या साइट पर आकर मुफ्त नाप और डिज़ाइन सलाह।"
        : "Doorstep measurements and sample consultation across Bemetara.",
    quoteF2Title: lang === "hi" ? "पारदर्शी डिजिटल कोटेशन" : "Itemized PDF Quotations",
    quoteF2Desc:
      lang === "hi"
        ? "कमरा-वार पारदर्शी डिजिटल PDF बिल।"
        : "Clear itemized PDF quotes with digital authenticity check.",
    quoteF3Title:
      lang === "hi" ? "सीधा संपर्क" : "Direct Support",
    quoteFormTitle: lang === "hi" ? "व्हाट्सएप पूछताछ" : "Quick WhatsApp Inquiry",
    quoteFormSub:
      lang === "hi"
        ? "तुरंत जवाब पाने के लिए नीचे विवरण भरें।"
        : "Fill details below to get an instant quote on WhatsApp.",
    lblService: lang === "hi" ? "सर्विस चुनें" : "Service",
    lblProperty: lang === "hi" ? "प्रॉपर्टी का प्रकार" : "Property Type",
    lblName: lang === "hi" ? "आपका नाम" : "Your Name",
    lblPhone: lang === "hi" ? "मोबाइल नंबर" : "Phone Number",
    lblLocation:
      lang === "hi" ? "इलाका (जैसे बेमेतरा, दुर्ग)" : "Location (e.g. Bemetara, Durg)",
    btnSendInquiry:
      lang === "hi" ? "व्हाट्सएप पर भेजें" : "Send on WhatsApp",
    formGuar:
      lang === "hi"
        ? "⚡ तुरंत जवाब • 100% निशुल्क परामर्श"
        : "⚡ Fast response • 100% Free Consultation",
    whySub: lang === "hi" ? "खासियत" : "Why Choose Us",
    whyTitle:
      lang === "hi"
        ? "फातिमा ट्रेडर्स ही क्यों?"
        : "Why Choose Famtima Traders?",
    why1Title: lang === "hi" ? "सीधे कारीगर" : "Direct Craftsmen",
    why1Desc:
      lang === "hi"
        ? "बिना किसी बिचौलिए के सीधे कारीगर से काम—उचित दाम और बेहतरीन फिनिश।"
        : "Direct artisan execution without middleman markups for honest rates.",
    why2Title: lang === "hi" ? "पारदर्शी व पक्का बिल" : "Transparent Itemized Billing",
    why2Desc:
      lang === "hi"
        ? "हर कोटेशन और बिल में सामग्री व दरों का स्पष्ट विवरण, बिना किसी छिपे शुल्क के।"
        : "Every quotation and invoice features complete itemized pricing with zero hidden charges.",
    why3Title: lang === "hi" ? "समय पर डिलीवरी" : "On-Time Completion",
    why3Desc:
      lang === "hi"
        ? "तय समय सीमा के अंदर साफ-सुथरा और गुणवत्तापूर्ण काम पूरा।"
        : "Strict committed timelines and clean project handover.",
    why4Title: lang === "hi" ? "प्रीमियम मटेरियल" : "Premium Materials",
    why4Desc:
      lang === "hi"
        ? "मजबूत जिप्सम, ग्रेड-1 POP और 100% वाटरप्रूफ PVC पैनल्स।"
        : "High-grade POP, heavy-gauge waterproof PVC, and branded hardware.",
    areasSub: lang === "hi" ? "सेवा क्षेत्र" : "Service Areas",
    areasTitle:
      lang === "hi"
        ? "बेमेतरा और आसपास के क्षेत्र"
        : "Areas We Serve in Chhattisgarh",
    areasDesc:
      lang === "hi"
        ? "बेमेतरा, दुर्ग, रायपुर और आसपास के शहरों में ऑन-साइट इंस्टॉलेशन उपलब्ध है।"
        : "On-site measurement and execution across Bemetara, Durg, Raipur & nearby hubs.",
    faqSub: lang === "hi" ? "सवाल-जवाब" : "FAQs",
    faqTitle:
      lang === "hi"
        ? "अक्सर पूछे जाने वाले सवाल"
        : "Frequently Asked Questions",
    ctaTitle:
      lang === "hi"
        ? "अपने घर को नया लुक देने के लिए तैयार हैं?"
        : "Ready to Upgrade Your Space?",
    ctaDesc:
      lang === "hi"
        ? "मुफ्त साइट विज़िट और तुरंत कोटेशन के लिए आज ही संपर्क करें।"
        : "Contact Famtima Traders today for a free site visit and estimate.",
    ctaChatBtn:
      lang === "hi"
        ? `व्हाट्सएप पर चैट करें`
        : `Chat on WhatsApp`,
  };

  function handleWhatsAppSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.trim() || "Not provided";
    const cleanName = name.trim() || "Valued Customer";
    const cleanArea = area.trim() || "Bemetara";

    const message = encodeURIComponent(
      `Hello Famtima Traders!\n\nI would like to get a free estimate and design consultation for:\n• Service: ${quoteService}\n• Property Type: ${propertyType}\n• Name: ${cleanName}\n• Contact: ${cleanPhone}\n• Location: ${cleanArea}\n• Preferred Language: ${lang === "hi" ? "Hindi" : "English"}\n\nPlease contact me with quotation details.`,
    );
    window.open(`https://wa.me/91${phonePrimary}?text=${message}`, "_blank");
  }

  const services = [
    {
      id: "home-decor",
      title: "Home Decoration & Styling",
      badge: "Living & Bedroom",
      description:
        "Modern interior styling and decorative solutions tailored for living rooms, halls, and bedrooms.",
      features: [
        "Aesthetic hall & bedroom styling",
        "Designer accents & partitions",
        "Turnkey finish with quality materials",
      ],
      priceHint: landingConfig.rates.commercial || "Contact for Pricing",
      image: "/images/pop-ceiling-nashik.webp",
    },
    {
      id: "pop",
      title: "POP False Ceiling Work",
      badge: "Designer Ceilings",
      description:
        "Premium Plaster of Paris false ceilings with concealed LED cove lighting and anti-crack framework.",
      features: [
        "Living room & bedroom cove lighting",
        "Anti-crack high-tensile plaster",
        "Thermal insulation & modern patterns",
      ],
      priceHint: landingConfig.rates.pop || "Contact for Pricing",
      image: "/images/pop-ceiling-nashik.webp",
    },
    {
      id: "pvc",
      title: "PVC Wall Panelling & Louvers",
      badge: "100% Waterproof",
      description:
        "Durable, termite-proof PVC panels and decorative fluted louvers. Perfect for damp walls and TV feature walls.",
      features: [
        "100% Waterproof & damp protection",
        "Zero paint odor & quick installation",
        "Fluted louvers, marble & wood finishes",
      ],
      priceHint: landingConfig.rates.pvc || "Contact for Pricing",
      image: "/images/pvc-wall-panels-nashik.webp",
    },
    {
      id: "renovation",
      title: "Renovation & Remodelling",
      badge: "Complete Makeover",
      description:
        "End-to-end residential and shop renovation with dedicated craftsmanship and on-time delivery.",
      features: [
        "Room, flat & shop remodelling",
        "Ceiling & wall restorations",
        "Timely handover with clean finish",
      ],
      priceHint: landingConfig.rates.gypsum || "Contact for Pricing",
      image: "/images/bedroom-gypsum-ceiling-nashik.webp",
    },
  ];

  const galleryItems = landingConfig.projects;

  const bemetaraAreas = [
    "Bemetara Town",
    "Krishna Vihar",
    "Durg",
    "Bhilai",
    "Raipur",
    "Bilaspur",
    "Rajnandgaon",
    "Kawardha",
    "Berla",
    "Nawagarh",
    "Saja",
    "Across Chhattisgarh",
  ];
  const nashikAreas = bemetaraAreas;

  const faqs = [
    {
      q: "What services does Famtima Traders provide?",
      a: "We specialize in home decoration, designer POP false ceilings, 100% waterproof PVC wall panelling, decorative louvers, and complete room and shop renovation.",
    },
    {
      q: "Why choose PVC wall panels for walls?",
      a: "PVC wall panels are 100% waterproof, termite-proof, and maintenance-free. They permanently cover damp walls while creating a modern, stylish look.",
    },
    {
      q: "How can I get an estimate for my space?",
      a: "Simply call or WhatsApp us at +91 7860854662. We'll discuss your room size and provide a free quotation and site visit.",
    },
    {
      q: "Do you undertake work outside Bemetara?",
      a: "Yes. While based in Bemetara (Krishna Vihar), our team handles false ceiling, PVC, and renovation projects across Durg, Bhilai, Raipur, Bilaspur, and surrounding Chhattisgarh districts.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-emerald-700 selection:text-white pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* Top Banner - Royal Navy Blue */}
      <aside
        aria-label="Announcement"
        className="border-b border-emerald-800 bg-emerald-900 px-3 py-1.5 sm:py-2 text-xs text-emerald-100 shadow-xs"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="flex size-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[11px] sm:text-xs leading-tight">{t.topBanner}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher Buttons (Hindi / English) */}
            <div className="flex items-center rounded-lg bg-emerald-950/90 p-0.5 border border-emerald-700/80 shadow-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  lang === "en"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  lang === "hi"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="हिंदी में पढ़ें"
              >
                हिंदी
              </button>
            </div>

            {/* Social Media Account Links */}
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-emerald-700/60">
              {landingConfig.social?.instagram && (
                <a
                  href={landingConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-white transition-colors p-1"
                  title="Follow us on Instagram"
                >
                  <Instagram className="size-3.5" />
                </a>
              )}
              {landingConfig.social?.youtube && (
                <a
                  href={landingConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-300 hover:text-white transition-colors p-1"
                  title="Subscribe on YouTube"
                >
                  <Youtube className="size-3.5" />
                </a>
              )}
              {landingConfig.social?.facebook && (
                <a
                  href={landingConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 hover:text-white transition-colors p-1"
                  title="Follow us on Facebook"
                >
                  <Facebook className="size-3.5" />
                </a>
              )}
            </div>

            <a
              href={`tel:+91${phonePrimary}`}
              className="hidden md:inline-flex items-center gap-1.5 font-semibold text-white hover:text-emerald-200 transition-colors"
            >
              <Phone className="size-3.5 text-emerald-300" />
              +91 {phonePrimary}
            </a>
            <span className="text-emerald-700 hidden lg:inline">|</span>
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1 text-emerald-200 hover:text-white transition-colors text-[11px]"
            >
              <ShieldCheck className="size-3.5" />
              {t.staffLogin}
            </Link>
          </div>
        </div>
      </aside>

      {/* Header - Crisp White with Royal Blue Accents & Perfect Responsive Structure */}
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2.5 xs:px-3 sm:px-6 py-2 sm:py-3">
          <Link to="/" className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink min-w-0">
            <img
              src={companyLogoUrl}
              alt="Famtima Traders Logo"
              className="size-8 sm:size-10 lg:size-11 rounded-full bg-white object-contain p-0.5 border-2 border-emerald-700 shadow-md shadow-emerald-700/10 shrink-0"
            />
            <div className="min-w-0">
              <span className="block font-display text-[13px] xs:text-sm sm:text-base lg:text-xl font-bold tracking-tight text-slate-950 leading-tight whitespace-normal sm:whitespace-nowrap">
                Famtima Traders
              </span>
              <span className="block text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold tracking-wider text-emerald-800 uppercase leading-none mt-0.5 whitespace-normal sm:whitespace-nowrap">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600"
          >
            <a href="#services" className="hover:text-emerald-700 transition-colors">
              {t.navServices}
            </a>
            <a href="#pop" className="hover:text-emerald-700 transition-colors">
              {t.navPop}
            </a>
            <a href="#pvc" className="hover:text-emerald-700 transition-colors">
              {t.navPvc}
            </a>
            <a href="#founder" className="hover:text-emerald-700 transition-colors">
              {t.navFounder}
            </a>
            <a href="#gallery" className="hover:text-emerald-700 transition-colors">
              {t.navGallery}
            </a>
            <a href="#areas" className="hover:text-emerald-700 transition-colors">
              {t.navAreas}
            </a>
            <a href="#quote" className="hover:text-emerald-700 transition-colors">
              {t.navQuote}
            </a>
            <a href="#faqs" className="hover:text-emerald-700 transition-colors">
              {t.navFaqs}
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2.5 min-w-0">
            {/* Header Social Icons (Tablet & Desktop) */}
            {(landingConfig.social?.instagram ||
              landingConfig.social?.youtube ||
              landingConfig.social?.facebook) && (
              <div className="hidden xl:flex items-center gap-1.5 pr-1 border-r border-slate-200">
                {landingConfig.social?.instagram && (
                  <a
                    href={landingConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-pink-600 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="size-4" />
                  </a>
                )}
                {landingConfig.social?.youtube && (
                  <a
                    href={landingConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="size-4" />
                  </a>
                )}
                {landingConfig.social?.facebook && (
                  <a
                    href={landingConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="size-4" />
                  </a>
                )}
              </div>
            )}

            <a
              href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
                "Hello Famtima Traders, I found your website and would like to inquire about home decoration, false ceiling, and PVC work in Bemetara.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-2 xs:px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 transition-all shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="size-3.5 sm:size-4 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <a
              href={`tel:+91${phonePrimary}`}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 xs:px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all shadow-xs shrink-0"
              title={`Call +91 ${phonePrimary}`}
            >
              <Phone className="size-3.5 sm:size-4 shrink-0" />
              <span className="hidden sm:inline">{t.btnCall}</span>
            </a>

            <Link
              to="/auth"
              className="hidden md:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all shrink-0"
              title="Employee & Admin CRM Portal"
            >
              <span>Portal</span>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-3">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navServices}
              </a>
              <a
                href="#pop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navPop}
              </a>
              <a
                href="#pvc"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navPvc}
              </a>
              <a
                href="#founder"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navFounder}
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navGallery}
              </a>
              <a
                href="#areas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navAreas}
              </a>
              <a
                href="#quote"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navQuote}
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {t.navFaqs}
              </a>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                CRM Portal
              </Link>
            </div>

            {/* Mobile Language Switcher inside Drawer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Languages className="size-4 text-emerald-700" />
                Language / भाषा:
              </span>
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === "en"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    lang === "hi"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Mobile Social Links in Drawer */}
            {(landingConfig.social?.instagram ||
              landingConfig.social?.youtube ||
              landingConfig.social?.facebook) && (
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100 text-slate-600">
                {landingConfig.social?.instagram && (
                  <a
                    href={landingConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:text-pink-600 text-pink-600"
                    title="Instagram"
                  >
                    <Instagram className="size-4" />
                  </a>
                )}
                {landingConfig.social?.youtube && (
                  <a
                    href={landingConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:text-red-600 text-red-600"
                    title="YouTube"
                  >
                    <Youtube className="size-4" />
                  </a>
                )}
                {landingConfig.social?.facebook && (
                  <a
                    href={landingConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:text-emerald-700 text-emerald-700"
                    title="Facebook"
                  >
                    <Facebook className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section - Clean Blue & White Glow */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 pt-8 sm:pt-12 pb-16 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100">
        {/* Soft blue ambient glow accents - contained within bounds */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[320px] sm:size-[500px] lg:size-[600px] -translate-x-1/2 rounded-full bg-amber-400/15 blur-[100px] sm:blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 -z-10 size-[250px] sm:size-[400px] rounded-full bg-sky-300/20 blur-[90px] sm:blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs max-w-full">
                <Sparkles className="size-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{t.badge}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.2] break-words">
                {t.heroTitle1} <span className="text-emerald-700">{t.heroTitlePop}</span>{" "}
                {t.heroTitleAnd} <span className="text-emerald-900">{t.heroTitlePvc}</span>{" "}
                {t.heroTitleCity}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl break-words">
                {t.heroDesc}
              </p>

              {/* Trust Badges - Responsive Grid (2 cols on mobile, 4 on desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 pt-1">
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 xs:p-3 text-center shadow-xs min-w-0">
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-extrabold text-emerald-700">
                    {t.statExp}
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-tight">
                    {t.statExpSub}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 xs:p-3 text-center shadow-xs min-w-0">
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-extrabold text-emerald-700">
                    {t.statProj}
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-tight">
                    {t.statProjSub}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5 xs:p-3 text-center shadow-xs min-w-0">
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-extrabold text-emerald-700">
                    {t.statWaterproof}
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-tight">
                    {t.statWaterproofSub}
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 xs:p-3 text-center shadow-xs min-w-0">
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-extrabold text-emerald-700">
                    {t.statRating}
                  </div>
                  <div className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-emerald-700 mt-0.5 leading-tight">
                    {t.statRatingSub}
                  </div>
                </div>
              </div>

              {/* CTA buttons - full-width on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 xs:px-5 sm:px-6 py-3 xs:py-3.5 text-xs xs:text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all text-center min-w-0"
                >
                  <span className="truncate">{t.btnFreeEstimate}</span>
                  <ArrowRight className="size-4 shrink-0" />
                </a>
                <a
                  href={`tel:+91${phonePrimary}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 xs:px-5 sm:px-6 py-3 xs:py-3.5 text-xs xs:text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all text-center min-w-0"
                >
                  <Phone className="size-4 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    {t.btnCall} +91 {phonePrimary}
                  </span>
                </a>
              </div>

              <div className="flex items-start gap-2 text-xs font-medium text-slate-600 pt-1">
                <CheckCircle2 className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{t.trustLine}</span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative overflow-hidden rounded-2xl border-2 sm:border-4 border-white bg-white shadow-xl shadow-emerald-900/10">
                <div className="relative overflow-hidden bg-slate-900 aspect-square w-full">
                  <img
                    src="/images/pop-ceiling-nashik.webp"
                    srcSet="/images/pop-ceiling-nashik-sm.webp 600w, /images/pop-ceiling-nashik.webp 1200w"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    width={600}
                    height={600}
                    alt="Home decoration, false ceiling, and interior work by Famtima Traders Bemetara"
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 flex items-center justify-between gap-1.5 pointer-events-none">
                    <span className="rounded-full bg-emerald-900/90 backdrop-blur-md px-2 xs:px-2.5 py-0.5 sm:py-1 text-[9px] xs:text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-md border border-emerald-400/30 truncate max-w-[62%] sm:max-w-none">
                      {t.featuredBadge}
                    </span>
                    <span className="rounded-full bg-emerald-700/95 backdrop-blur-md px-2 xs:px-2.5 py-0.5 sm:py-1 text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-white shadow-md border border-emerald-400/30 shrink-0">
                      ✓ {t.featuredCompleted}
                    </span>
                  </div>
                </div>

                {/* Clear uncropped Project Details bar directly below the photo */}
                <div className="p-3 xs:p-3.5 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm font-bold text-slate-900 truncate">
                      Modern Living Room POP Ceiling
                    </p>
                    <p className="text-[11px] xs:text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="size-3 xs:size-3.5 text-emerald-700 shrink-0" />
                      Krishna Vihar, Bemetara
                    </p>
                  </div>
                  <a
                    href="#gallery"
                    className="shrink-0 text-[11px] xs:text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 xs:px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-colors"
                  >
                    View All →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section - Soft Blue Tinted Background */}
      <section id="services" className="border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              {t.servicesSub}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t.servicesTitle}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">{t.servicesDesc}</p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {services.map((svc) => (
              <div
                key={svc.id}
                id={svc.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-600/10 flex flex-col justify-between"
              >
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <img
                      src={svc.image}
                      alt={`${svc.title} by Famtima Traders Bemetara`}
                      width={600}
                      height={450}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-2.5 sm:space-y-3">
                    <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                      {svc.badge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {svc.description}
                    </p>
                    <ul className="space-y-1.5 pt-1 text-xs text-slate-600">
                      {svc.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-700 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">
                        {svc.priceHint}
                      </span>
                      <a
                        href="#quote"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>{t.btnBookVisit}</span>
                        <ChevronRight className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Work Gallery - Pure White Background */}
      {/* Founder & Global Experience Section */}
      <section id="founder" className="py-16 sm:py-20 border-t border-slate-200/80 bg-gradient-to-b from-white via-emerald-50/25 to-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 size-96 rounded-full bg-emerald-200/20 blur-3xl -z-10" />
        <div className="pointer-events-none absolute top-1/3 right-0 size-96 rounded-full bg-amber-200/20 blur-3xl -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50/80 px-3.5 py-1 text-xs font-bold text-amber-800 shadow-xs">
              <Globe className="size-3.5 text-amber-600" />
              <span>{t.founderBadge}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.founderTitle}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              {t.founderDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Card: Founder Profile & Direct Message (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-2 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700" />

              {/* Founder Header */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src="/anwar-khan.png"
                    alt="Anwar Khan - Founder Famtima Traders"
                    className="size-20 sm:size-24 rounded-full object-cover border-2 border-emerald-600 shadow-md ring-4 ring-emerald-100"
                    loading="lazy"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 size-7 rounded-full bg-emerald-700 text-white flex items-center justify-center border-2 border-white shadow-xs"
                    title="Verified Master Craftsman"
                  >
                    <CheckCircle2 className="size-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Anwar Khan
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    {t.founderRole}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="size-3 text-emerald-600 shrink-0" />
                    <span>Bemetara, Chhattisgarh</span>
                  </div>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                <div className="space-y-0.5">
                  <span className="block text-lg font-extrabold text-slate-900">15+</span>
                  <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t.statYears}</span>
                </div>
                <div className="space-y-0.5 border-x border-slate-100">
                  <span className="block text-lg font-extrabold text-amber-600">4</span>
                  <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t.statCountries}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-lg font-extrabold text-emerald-700">100%</span>
                  <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t.statSupervision}</span>
                </div>
              </div>

              {/* Geographic Experience Badges */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.internationalFootprint}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80 px-2.5 py-1.5 font-medium text-emerald-950">
                    <span className="text-sm">🇸🇦</span>
                    <span className="truncate">Saudi Arabia (SACODECO)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80 px-2.5 py-1.5 font-medium text-emerald-950">
                    <span className="text-sm">🇦🇪</span>
                    <span className="truncate">Dubai (UAE)</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80 px-2.5 py-1.5 font-medium text-emerald-950">
                    <span className="text-sm">🇶🇦</span>
                    <span className="truncate">Qatar</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 border border-emerald-100/80 px-2.5 py-1.5 font-medium text-emerald-950">
                    <span className="text-sm">🇮🇳</span>
                    <span className="truncate">India (Chhattisgarh)</span>
                  </div>
                </div>
              </div>

              {/* Founder Personal Quote */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 relative">
                <div className="text-xs sm:text-[13px] text-slate-700 italic leading-relaxed">
                  {t.founderQuote}
                </div>
              </div>

              {/* Direct Connect Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={`tel:+91${phonePrimary}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 shadow-sm transition-all"
                >
                  <Phone className="size-4" />
                  <span>+91 {phonePrimary}</span>
                </a>
                <a
                  href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
                    "Hello Anwar Khan ji, I visited the Famtima Traders website and would like to discuss interior/false ceiling work for my property."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-xs sm:text-sm py-2.5 px-4 shadow-xs transition-all"
                >
                  <MessageSquare className="size-4 text-emerald-700" />
                  <span>{t.founderChatBtn}</span>
                </a>
              </div>
            </div>

            {/* Right Card: Experience Certificate Document & 4 Key Guarantees (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Certificate Image Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative group">
                  <img
                    src="/international-experience.png"
                    alt="Anwar Khan - International Work Experience Certificate Saudi Arabia SACODECO"
                    className="w-full h-auto rounded-xl object-contain bg-slate-50 border border-slate-100"
                    loading="lazy"
                  />
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] sm:text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-900">
                      <Award className="size-3.5 text-amber-600" />
                      <span>{t.certVerified}</span>
                    </div>
                    <span className="text-slate-400">SACODECO • 2014–2016</span>
                  </div>
                </div>
              </div>

              {/* 4 Pillars of Gulf-Standard Workmanship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="size-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.pillar1Title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{t.pillar1Desc}</p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="size-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.pillar2Title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{t.pillar2Desc}</p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Clock className="size-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.pillar3Title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{t.pillar3Desc}</p>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="size-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Layers className="size-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.pillar4Title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{t.pillar4Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-16 sm:py-20 border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {t.gallerySub}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                {t.galleryTitle}
              </h2>
            </div>
            <a
              href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
                "Hello Famtima Traders, please share your latest home decoration and false ceiling design photo catalogue.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>{t.galleryBtn}</span>
              <ArrowRight className="size-4 shrink-0" />
            </a>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden aspect-square relative bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={`${item.title} in ${item.location}`}
                      width={600}
                      height={450}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-emerald-900/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                      {item.category}
                    </span>
                    {item.videoUrl && (
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-red-600/90 hover:bg-red-700 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white shadow-md transition-all"
                      >
                        <Video className="size-3.5" />
                        <span>{t.btnWatchClip}</span>
                      </a>
                    )}
                  </div>
                  <div className="p-3.5 sm:p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="size-3 text-emerald-700 shrink-0" />
                      {item.location}
                    </p>
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 pt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 pt-0">
                  <a
                    href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
                      `Hello Famtima Traders! I liked your project "${item.title}" in ${item.location}. Can you provide an estimate for a similar design?`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all text-center"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>{t.btnSimilarQuote}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Quotation Form & WhatsApp Estimator - Crisp Clean Gradient */}
      <section
        id="quote"
        className="py-16 sm:py-20 border-t border-slate-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/40"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                {t.quoteSub}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
                {t.quoteTitle}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                {t.quoteDesc}
              </p>

              <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.quoteF1Title}</h3>
                    <p className="text-xs text-slate-600">{t.quoteF1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.quoteF2Title}</h3>
                    <p className="text-xs text-slate-600">{t.quoteF2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.quoteF3Title}</h3>
                    <p className="text-xs text-slate-600">
                      Call directly at{" "}
                      <strong className="text-emerald-900 font-semibold">+91 {phonePrimary}</strong> or{" "}
                      <strong className="text-emerald-900 font-semibold">+91 {phoneSecondary}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card - White Card with Blue Accents */}
            <div className="lg:col-span-6">
              <Card className="border-slate-200 bg-white shadow-xl shadow-emerald-900/5">
                <CardContent className="p-4 xs:p-6 sm:p-8">
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-lg font-bold text-emerald-950">{t.quoteFormTitle}</h3>
                      <p className="text-xs text-slate-500">{t.quoteFormSub}</p>
                    </div>

                    <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="service-select"
                          className="text-xs font-semibold text-slate-700"
                        >
                          {t.lblService}
                        </Label>
                        <select
                          id="service-select"
                          value={quoteService}
                          onChange={(e) => setQuoteService(e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                        >
                          <option value="Home Decoration & Styling">Home Decoration & Styling</option>
                          <option value="POP False Ceiling Work">POP False Ceiling Work</option>
                          <option value="PVC Wall Panelling & Louvers">
                            PVC Wall Panelling & Louvers
                          </option>
                          <option value="Renovation & Remodelling">Renovation & Remodelling</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="property-select"
                          className="text-xs font-semibold text-slate-700"
                        >
                          {t.lblProperty}
                        </Label>
                        <select
                          id="property-select"
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-700 focus:outline-hidden"
                        >
                          <option value="1BHK Flat">1BHK Flat</option>
                          <option value="2BHK Flat">2BHK Flat</option>
                          <option value="3BHK Flat / Rowhouse">3BHK Flat / Rowhouse</option>
                          <option value="Bungalow / Villa">Bungalow / Villa</option>
                          <option value="Commercial Shop / Office">Commercial Shop / Office</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cust-name" className="text-xs font-semibold text-slate-700">
                        {t.lblName}
                      </Label>
                      <Input
                        id="cust-name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-700"
                        required
                      />
                    </div>

                    <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cust-phone"
                          className="text-xs font-semibold text-slate-700"
                        >
                          {t.lblPhone}
                        </Label>
                        <Input
                          id="cust-phone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-700"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="cust-area" className="text-xs font-semibold text-slate-700">
                          {t.lblLocation}
                        </Label>
                        <Input
                          id="cust-area"
                          type="text"
                          placeholder="e.g. Bemetara / Durg"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-700"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 sm:py-6 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 text-center"
                    >
                      <Send className="size-4 shrink-0" />
                      <span className="truncate">{t.btnSendInquiry}</span>
                    </Button>

                    <p className="text-center text-[11px] text-slate-500">{t.formGuar}</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Famtima Traders */}
      <section className="py-16 sm:py-20 border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              {t.whySub}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              {t.whyTitle}
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-2.5 sm:space-y-3 shadow-xs">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Award className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.why1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.why1Desc}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-2.5 sm:space-y-3 shadow-xs">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.why2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.why2Desc}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-2.5 sm:space-y-3 shadow-xs">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Clock className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.why3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.why3Desc}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-2.5 sm:space-y-3 shadow-xs">
              <div className="size-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Layers className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.why4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.why4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Across Bemetara & Chhattisgarh */}
      <section id="areas" className="py-14 sm:py-16 border-t border-slate-200/80 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              {t.areasSub}
            </span>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              {t.areasTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">{t.areasDesc}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {nashikAreas.map((areaName, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-all shadow-xs"
              >
                <MapPin className="size-3 text-emerald-700" />
                <span>{areaName}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section id="faqs" className="py-16 sm:py-20 border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              {t.faqSub}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.faqTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm md:text-base font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-slate-400 shrink-0 ml-2 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Strip - Royal Blue Accent */}
      <section className="border-t border-emerald-900 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 py-12 sm:py-16 text-white pb-24 md:pb-16">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-5 sm:space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {t.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {t.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <a
              href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
                "Hello Famtima Traders, I would like to schedule a site visit for POP / PVC / Home Decoration work in Bemetara.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800 transition-all text-center"
            >
              <MessageSquare className="size-4 shrink-0" />
              <span>{t.ctaChatBtn}</span>
            </a>
            <a
              href={`tel:+91${phonePrimary}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 transition-all text-center"
            >
              <Phone className="size-4 text-emerald-700 shrink-0" />
              <span>
                {t.btnCall} +91 {phonePrimary}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Quick Action Bar (Never Moves / Always in Fixed Place) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2 shadow-2xl">
        <a
          href={`https://wa.me/91${phonePrimary}?text=${encodeURIComponent(
            "Hello Famtima Traders, I would like to get a quote for POP / PVC / Home Decoration work in Bemetara.",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 px-2 text-xs font-bold text-white shadow-md active:bg-emerald-800"
        >
          <MessageSquare className="size-4 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>

        <a
          href={`tel:+91${phonePrimary}`}
          className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 px-2 text-xs font-bold text-white shadow-md active:bg-emerald-700"
        >
          <Phone className="size-4 shrink-0" />
          <span className="truncate">Call Now</span>
        </a>

        <a
          href="#quote"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-slate-700 hover:bg-slate-200 shrink-0"
          title="Estimate"
        >
          <Send className="size-4 text-emerald-700" />
        </a>
      </div>

      {/* Footer - Deep Navy */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12 text-xs text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={companyLogoUrl}
                  alt={company?.name || "Famtima Traders"}
                  className="size-8 rounded-full bg-white p-0.5 object-contain"
                />
                <span className="font-display text-base font-bold text-white">
                  {company?.name || "Famtima Traders"}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Bemetara's trusted specialists in home decoration, designer POP false ceilings,
                100% waterproof PVC wall panels, and renovation.
              </p>
              <p className="text-emerald-400 font-medium">
                Shop No. 08, Krishna Vihar, Bemetara, CG
              </p>

              {/* Official Social Media Channels */}
              <div className="pt-2 flex items-center gap-3">
                {landingConfig.social?.instagram && (
                  <a
                    href={landingConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white hover:border-pink-500 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="size-3.5 text-pink-500" />
                    <span className="text-[11px]">Instagram</span>
                  </a>
                )}
                {landingConfig.social?.youtube && (
                  <a
                    href={landingConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white hover:border-red-500 transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="size-3.5 text-red-500" />
                    <span className="text-[11px]">YouTube</span>
                  </a>
                )}
                {landingConfig.social?.facebook && (
                  <a
                    href={landingConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white hover:border-emerald-600 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="size-3.5 text-emerald-600" />
                    <span className="text-[11px]">Facebook</span>
                  </a>
                )}
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <p className="font-semibold text-white uppercase tracking-wider text-xs">
                Key Services
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li>Home Decoration &amp; Styling</li>
                <li>POP Work &amp; False Ceiling</li>
                <li>PVC Wall Panelling &amp; Louvers</li>
                <li>Renovation &amp; Remodelling</li>
                <li>Commercial Interiors</li>
                <li>LED Cove Light Channels</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <p className="font-semibold text-white uppercase tracking-wider text-xs">
                Contact &amp; Hours
              </p>
              <p className="text-slate-300">
                <strong>Address:</strong> Shop No. 08, Krishna Vihar, Bemetara, CG 491335
              </p>
              <p className="text-slate-300">
                <strong>WhatsApp / Phone:</strong> +91 {phonePrimary}
              </p>
              <p className="text-slate-300">
                <strong>Alternate Phone:</strong> +91 {phoneSecondary}
              </p>
              <p className="text-slate-300">
                <strong>Email:</strong> anwaarrza850@gmail.com
              </p>
              <p className="text-slate-300">
                <strong>Hours:</strong> Mon - Sun: 9:00 AM - 8:00 PM
              </p>
            </div>

            {/* Col 4 */}
            <div className="space-y-2">
              <p className="font-semibold text-white uppercase tracking-wider text-xs">
                Quick Access
              </p>
              <div className="space-y-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-600 transition-colors w-full justify-center"
                >
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>Admin &amp; Employee Portal</span>
                </Link>
                <p className="text-[11px] text-slate-300 text-center">
                  Secure staff login for quotations, billing, and receipts.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300">
            <p>
              © {new Date().getFullYear()} {company?.name || "Famtima Traders"}. All rights
              reserved. Bemetara, Chhattisgarh.
            </p>
            <p className="text-slate-300">
              Keywords:{" "}
              <span className="text-slate-200">
                famtima traders • bemetara pop • pvc bemetara • home decoration chhattisgarh
              </span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

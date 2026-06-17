"use server";

import { connectDB } from "@/lib/db";
import Item from "@/models/Item";
import { generateSlug } from "@/lib/utils";

// Public sample images from Cloudinary (used in Stitch design mockups)
const COIN_IMAGES = [
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638323/ntik-heritage/ntik-heritage/AB6AXuCMLg5OYopDr2D1oEDAvb-WFTuhwA0NDOre.jpg",
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638324/ntik-heritage/ntik-heritage/AB6AXuC6zLjV2FHpeOV3leANE_ZL-6-x8wmLWbvl.jpg",
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638326/ntik-heritage/ntik-heritage/AB6AXuBbDtl1JBoS5ChC8SBrss6N9Zw7CUY81YTQ.jpg",
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638327/ntik-heritage/ntik-heritage/AB6AXuBMWapH3OKywZs8KpsVaZmR2tqKpe1a6JBi.jpg",
];

const NOTE_IMAGES = [
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638329/ntik-heritage/ntik-heritage/AB6AXuBd5YErC9DpF9WyyDyKEGsnZdo5INriaJDo.jpg",
  "https://res.cloudinary.com/djprgnsae/image/upload/v1781638330/ntik-heritage/ntik-heritage/AB6AXuB2nHYjlAmUOdnD9xTMzN-UNYQNXV1AByg7.jpg",
];

const SAMPLE_ITEMS = [
  {
    slug: "seed-1835-british-india-gold-mohur-c0001",
    itemNumber: "C0001",
    title: "1835 British India Gold Mohur",
    type: "coin" as const,
    year: "1835",
    description:
      "The 1835 Gold Mohur stands as a monumental transition in the numismatic history of the Indian subcontinent. It was the first currency issued across the entirety of British India under the Uniform Coinage Act of 1835.\n\nThe obverse features the left-facing bust of King William IV, engraved with masterful precision. The reverse depicts the iconic lion standing beneath a palm tree, a symbol of the East India Company.",
    historicalContext:
      "The 1835 Gold Mohur stands as a monumental transition in the numismatic history of the Indian subcontinent. It was the first currency to be issued across the entirety of British India, following the Uniform Coinage Act of 1835.\n\nThe obverse features the left-facing bust of King William IV, engraved with masterful precision. The reverse depicts the iconic lion standing beneath a palm tree, a symbol that would come to represent the East India Company.",
    price: 450000,
    frontImage: COIN_IMAGES[0],
    backImage: COIN_IMAGES[1],
    denomination: "One Mohur",
    composition: "0.917 Gold (22K)",
    weight: "11.66 Grams",
    mint: "Calcutta (No Mint Mark)",
    diameter: "26.2 mm",
    rarity: "RRR" as const,
    grade: "MS-64",
    gradeType: "Proof-Like",
    featured: true,
    provenance: [
      { period: "1835 – 1840", description: "Struck at the Calcutta Mint; part of the initial inaugural emission under the Uniform Coinage Act." },
      { period: "1922 – 1965", description: "Acquired by the Maharaja of Patiala collection. Documented in the 1928 inventory as 'Fine Proof-like Specimen'." },
      { period: "2014 – Present", description: "Acquired via Spink & Son, London. Current archival status: Vault 04, NTIK Mumbai." },
    ],
  },
  {
    slug: "seed-empress-gold-sovereign-1877-c0002",
    itemNumber: "C0002",
    title: "Empress Gold Sovereign 1877",
    type: "coin" as const,
    year: "1877",
    description:
      "Queen Victoria Gold Sovereign from 1877, the year Victoria was proclaimed Empress of India. Continuous legend variant with exceptional luster and strike quality. Struck at the Bombay Mint.",
    price: 320000,
    frontImage: COIN_IMAGES[2],
    backImage: COIN_IMAGES[0],
    denomination: "One Sovereign",
    composition: "0.917 Gold (22K)",
    weight: "7.98 Grams",
    mint: "Bombay Mint",
    diameter: "22.0 mm",
    rarity: "RR" as const,
    grade: "MS-63",
    gradeType: "Business Strike",
    featured: true,
    provenance: [
      { period: "1877", description: "Struck at Bombay Mint in the year Victoria was proclaimed Empress of India." },
      { period: "1940s", description: "Part of a private British-Indian family estate in Madras." },
    ],
  },
  {
    slug: "seed-shah-jahan-gold-mohur-c0003",
    itemNumber: "C0003",
    title: "Shah Jahan Gold Mohur",
    type: "coin" as const,
    year: "1042 AH",
    description:
      "Mughal Empire Gold Mohur of Emperor Shah Jahan, 1042 AH (circa 1632 AD). Surat Mint. Exquisitely preserved calligraphy and full weight. Features complex Persian calligraphy and intricate floral patterns.",
    price: 680000,
    frontImage: COIN_IMAGES[3],
    backImage: COIN_IMAGES[1],
    denomination: "One Mohur",
    composition: "0.969 Gold",
    weight: "10.95 Grams",
    mint: "Surat Mint",
    diameter: "20.5 mm",
    rarity: "RR" as const,
    grade: "AU-58",
    gradeType: "About Uncirculated",
    featured: false,
  },
  {
    slug: "seed-victoria-10-rupees-1870-c0004",
    itemNumber: "C0004",
    title: "Victoria Queen 10 Rupees 1870",
    type: "coin" as const,
    year: "1870",
    description:
      "Rare British India 10 Rupees Gold coin, 1870. Proof emission, exceptionally rare in this preservation state. Struck at the Calcutta Mint with mirror-like fields.",
    price: 950000,
    frontImage: COIN_IMAGES[0],
    backImage: COIN_IMAGES[2],
    denomination: "Ten Rupees",
    composition: "0.917 Gold (22K)",
    weight: "11.66 Grams",
    mint: "Calcutta Mint",
    diameter: "28.5 mm",
    rarity: "RRR" as const,
    grade: "PR-65",
    gradeType: "Deep Cameo Proof",
    featured: true,
  },
  {
    slug: "seed-british-india-10-rupees-note-n0001",
    itemNumber: "N0001",
    title: "British India 10 Rupees Note",
    type: "note" as const,
    year: "1917",
    description:
      "Paper currency of the Government of India, 10 Rupees denomination. Features early portrait series and bank signature of the early 20th century. Calcutta issue.",
    price: 85000,
    frontImage: NOTE_IMAGES[0],
    backImage: NOTE_IMAGES[1],
    denomination: "Ten Rupees",
    composition: "Government of India Issue",
    mint: "Calcutta",
    rarity: "R" as const,
    grade: "VF-30",
    gradeType: "Very Fine",
    featured: false,
  },
  {
    slug: "seed-rbi-one-rupee-1940-n0002",
    itemNumber: "N0002",
    title: "Reserve Bank of India 1 Rupee 1940",
    type: "note" as const,
    year: "1940",
    description:
      "Reserve Bank of India One Rupee note, 1940. Features the geometric rosette watermark and the George VI portrait variant. Signed by C.D. Deshmukh. WWII emergency issue.",
    price: 45000,
    frontImage: NOTE_IMAGES[1],
    backImage: NOTE_IMAGES[0],
    denomination: "One Rupee",
    composition: "Reserve Bank of India",
    mint: "Government of India",
    rarity: "RR" as const,
    grade: "EF-45",
    gradeType: "Extremely Fine",
    featured: false,
  },
];

export async function seedSampleItems(): Promise<{ created: number; skipped: number }> {
  await connectDB();

  let created = 0;
  let skipped = 0;

  for (const sample of SAMPLE_ITEMS) {
    const existing = await Item.findOne({ slug: sample.slug });
    if (existing) {
      skipped++;
      continue;
    }

    await Item.create({
      ...sample,
      slug: generateSlug(sample.title) + "-" + sample.itemNumber.toLowerCase(),
      views: 0,
      sold: false,
      categories: [],
      additionalImages: [],
    });
    created++;
  }

  return { created, skipped };
}

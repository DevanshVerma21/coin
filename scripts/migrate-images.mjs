/**
 * migrate-images.mjs
 * Uploads every lh3.googleusercontent.com image to Cloudinary,
 * then patches source files and MongoDB documents with the new URLs.
 *
 * Run: node scripts/migrate-images.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import { readFileSync, writeFileSync } from "fs";
import { MongoClient } from "mongodb";

// ── Load .env.local manually (no dotenv needed) ───────────────────────────────
const envText = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// ── All lh3 URLs in the codebase ─────────────────────────────────────────────
const IMAGES = [
  // seed.ts COIN_IMAGES
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCMLg5OYopDr2D1oEDAvb-WFTuhwA0NDOreLae8M9-8YiDLxtA8DfDVnr0PyTxvbUH4ccaiSMjYkW-5JY4wJb5MEo7oqB45_u0YxsfXZIKtiS3ftHmPtoy_8zM3KB4R6TP_no3rnIavLhyTqF00o_mm-WgttI-wRXwn65p3NLIHalYtC6tg6JASLZPkkJFNhA0vHC96-rndK7rK_U9rAeGsnjUfkcmTqvtK7xceoB8PnJ3Pjd82fJGZSVc-rKeecJx6svlo2WqeYtA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC6zLjV2FHpeOV3leANE_ZL-6-x8wmLWbvlG4qLrMChRayrcqKNQA4G_0Lwxqntr1Q9fLiaT3K-o7aDPP02DrRbxQu5C4rQiBZEPUonPlUXdVJ7aFoM_vYgQDC5C7OexNMBSV8adLZOVqXtwuoEfH12qbuj60HzhOeuofCzOjgNG9C_Ye0uWE0x5P3k6t5di3M6expOycO4vjPKf8LIL6w-LweVSZXawWvj8jTjLPxmIFn-VwbDUVKn2SKy0IocS0bG_hGLsXcp3WE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbDtl1JBoS5ChC8SBrss6N9Zw7CUY81YTQC5qMfifNrF6JJHwg81mrwKM8M0eRC5CYlN_W71ET2FkQmOOdWwDT9r_HcF_1Mi3KMyuKfEck72yv83CvUy5Y98sDemind6y3qSrnUp6GB-TcK_9FgnC4efaJDMClhv3-0wQgtUSzqcutvZRDGtqO-i_y8Ar5xCS-h0JCVXAo2PIIv_Diw72pitCKtZerAIA1D5BO57VBZIp8GeUbzGZ5y7IZEZl5KduU0-aS4UqKGY4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMWapH3OKywZs8KpsVaZmR2tqKpe1a6JBijjrdTJecYblHDYJ66CLfRxcfkXlADx_V_JWIYIP6dUkCqXmAiKiSICd3i9VvYfSz6yr4KFlSr13Euc8WdXo9J8HvrfqygIdMPU5fQ_VfobNyuqlI6SLK68AX01Jt9AIAIXXA1KNFqODCjzBZTYb2M_Vjae_vRCim_sAJ6OPvD_Nu5dtEpwbvmOuUenvK4bo3UT0reK_5OZWZnMjPIuSjGyMGePq69jG7c0ueY1OTNCw",
  // seed.ts NOTE_IMAGES
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5YErC9DpF9WyyDyKEGsnZdo5INriaJDodeCY5KzD6uLDxkF7YCi2fiW3zWqkuuzhxxQPGJVGdP3s0SovnGbM3buxj03qeIdirQxxOmebwvqblbRNvdH812r44Sygd6oEIjwGMglAkpfuWR2ZjUTXRZcKXvsPg9CXAg0A4wGaoydyySEBecRoTWCueD_Dv8tx-nO0gY_w2UKGjLkvooRnbhgYZhMqFhZgSxedIUHWett6DcN4j8wK0EdhrEbin6vQGNpGPvQ9H0k",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nHYjlAmUOdnD9xTMzN-UNYQNXV1AByg71X79TGzpJPRIbAHvcr43m4je6p_JAI2zYRAOMpPXBCHC4ft0oo-HXA7DQifaqL4yqpRJfOoXjkYLYAhvQSTojNZzkzGSrHSD2Wsw5MWGcqJS4-ITPZ-oa2s_20h9unftUKVovzdAb0CL12JwxMDsckpGUjbhF6bf_awlvs2CWpQP1z-g-mlNSkKhsrx7JvWmyTt6EOxxo2EMGmEM_gunOI9JCw5AxmdGEN6HoU0ThUM",
  // hero.tsx
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4YXq5--RR7gaBhG6CM9iNv-sOJWN7msF7eonQawpGHJeVELJzziL8Uc7_QUBvW7bTiyWPKSuooDfCVz4YTg1g8qJP1oL3mt1I-WwZLIls0gap33g70nUcuUzh8X55Kcq6HD26ZmzR6P8XAkA63s1QdI1GDmCXd6dfW0L85bW1bNtbXZMsmz6owRZazlJEvTjO4Jx3M4EihmQ5dIx794GUFG5VsbGkYdV49deOtSmI6o5EOj6G2WkY-yZD6SXtZq67QRwiiklCjC8",
  // archive-selection.tsx
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCA52vlYlCmUaTbBwhJToWjA8sYQIMVATqmch4SSaNjP94dC3h9gr213M8LsS4as86v9mCOY0qV29VaBPwu33SawKeKQ_LNrIZBnUfMYLQnkZkNMlI0FIFd0Ey_iKiPGNkiOtW0bQIrD6SJ8fF8Owkej9o1zW2kH49cVFT7_U2YQXFRO1pipXTM7FYbAypmXDD6hzF0u9cq6WhDzABk4s8f9rwMr8JE8dmBX1U1BlggKoKcPmKSsNjwQx521yyR-mjfqp4FBrRuZXg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QZUtXqCCVzPvQndjB-7CrrGHJswqFryqAG-5wEPN24ppu2WloysJSINrBmBo52OCzO1Y11VLmGi3DvqbebC7IaDG-V2oexJPlZ2sEsx8TS1y7_1PA8_6E95RLpab0BiMTdhzxInXhlfYutLGSvK24yZz37qv5lQ7X_Qk5yKFWi2CSFH1Zse56Iucqq40TBn_80Gf1I1AWZMsOzLnlr0culG4bd58jmbHH4OxLrjyaYyE4uhxQ8McL470QkvhQRKLfIf8nUBXNxI",
];

// ── Source files to patch ─────────────────────────────────────────────────────
const SOURCE_FILES = [
  "src/actions/seed.ts",
  "src/components/home/hero.tsx",
  "src/components/home/archive-selection.tsx",
];

async function uploadToCloudinary(url) {
  const publicId = `ntik-heritage/${url.split("/").pop().slice(0, 40)}`;
  try {
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      overwrite: false,          // skip if already uploaded
      resource_type: "image",
      folder: "ntik-heritage",
      transformation: [{ quality: "auto:best", fetch_format: "auto" }],
    });
    return result.secure_url;
  } catch (err) {
    // If overwrite:false and it already exists, the error contains the existing URL
    if (err.error?.http_code === 400 && err.error?.message?.includes("already exists")) {
      return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    }
    throw err;
  }
}

async function patchSourceFiles(urlMap) {
  for (const filePath of SOURCE_FILES) {
    let content = readFileSync(filePath, "utf8");
    let changed = false;
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      if (content.includes(oldUrl)) {
        content = content.replaceAll(oldUrl, newUrl);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(filePath, content, "utf8");
      console.log(`  ✓ Patched ${filePath}`);
    }
  }
}

async function patchMongoDB(urlMap) {
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const items = db.collection("items");

  let updated = 0;
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    // Patch frontImage
    const r1 = await items.updateMany(
      { frontImage: oldUrl },
      { $set: { frontImage: newUrl } }
    );
    // Patch backImage
    const r2 = await items.updateMany(
      { backImage: oldUrl },
      { $set: { backImage: newUrl } }
    );
    // Patch additionalImages array
    const r3 = await items.updateMany(
      { additionalImages: oldUrl },
      { $set: { "additionalImages.$[el]": newUrl } },
      { arrayFilters: [{ el: oldUrl }] }
    );
    updated += r1.modifiedCount + r2.modifiedCount + r3.modifiedCount;
  }

  await client.close();
  console.log(`  ✓ MongoDB: updated ${updated} field(s) across items collection`);
}

async function main() {
  console.log(`\n🚀 NTIK Image Migration — lh3 → Cloudinary\n`);
  console.log(`Uploading ${IMAGES.length} images to Cloudinary (${env.CLOUDINARY_CLOUD_NAME})...\n`);

  const urlMap = {};
  let i = 0;
  for (const url of IMAGES) {
    i++;
    const short = url.split("/aida-public/")[1]?.slice(0, 20) ?? url.slice(-20);
    process.stdout.write(`  [${i}/${IMAGES.length}] Uploading ${short}... `);
    try {
      const newUrl = await uploadToCloudinary(url);
      urlMap[url] = newUrl;
      console.log(`✓`);
      console.log(`    → ${newUrl}`);
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n📝 Patching source files...\n`);
  await patchSourceFiles(urlMap);

  console.log(`\n🗄️  Patching MongoDB documents...\n`);
  await patchMongoDB(urlMap);

  console.log(`\n✅ Migration complete! ${IMAGES.length} images now on Cloudinary.\n`);
  console.log(`URL mapping written below for reference:\n`);
  for (const [old, nw] of Object.entries(urlMap)) {
    const short = old.split("/aida-public/")[1]?.slice(0, 30) ?? old.slice(-30);
    console.log(`  ${short}...`);
    console.log(`  → ${nw}\n`);
  }

  console.log(`\nNext steps:`);
  console.log(`  1. Run: npm run build`);
  console.log(`  2. Remove lh3.googleusercontent.com from next.config.ts remotePatterns`);
  console.log(`  3. Remove preconnect for lh3 from layout.tsx\n`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

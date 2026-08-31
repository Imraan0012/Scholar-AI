import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';

console.log(`Total Master Scholarships: ${MASTER_SCHOLARSHIP_REGISTRY.length}`);

for (let i = 0; i < MASTER_SCHOLARSHIP_REGISTRY.length; i++) {
  const s = MASTER_SCHOLARSHIP_REGISTRY[i];
  console.log(`[${i+1}] ${s.id}:`);
  console.log(`    Name: ${s.name}`);
  console.log(`    Website: ${s.official_website_url}`);
  console.log(`    AppUrl:  ${s.official_application_url}`);
  console.log(`    PdfUrl:  ${s.official_guideline_pdf_url}`);
}

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main(){
  const p = path.join(process.cwd(),'lib','godrik','lore.yaml');
  if (!fs.existsSync(p)){
    console.error('No lore.yaml found at', p);
    process.exit(1);
  }
  const doc = yaml.load(fs.readFileSync(p,'utf-8'));
  const entries = doc?.entries || [];
  for (const e of entries){
    const slug = e.id || `l-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const tags = e.tags || [];
    const text = e.text || '';
    console.log('Upserting', slug);
    await prisma.loreEntry.upsert({
      where: { slug },
      update: { tags, text },
      create: { slug, tags, text }
    });
  }
  console.log('Done');
}

main().then(()=>process.exit(0)).catch((e)=>{ console.error(e); process.exit(1) });

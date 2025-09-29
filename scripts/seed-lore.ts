import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
// require prisma client directly to avoid loader differences
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const p = path.join(process.cwd(),'lib','godrik','lore.yaml');
  if (!fs.existsSync(p)){
    console.error('No lore.yaml found at', p);
    process.exit(1);
  }
  const doc = yaml.load(fs.readFileSync(p,'utf-8')) as { entries: any[] };
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

import { getContent } from '../lib/content.ts';

const content = await getContent();
console.log(`Contenus validés au ${content.updatedAt} : ${content.overview.length} points, ${content.faq.length} questions, ${content.figures.length} chiffres, ${content.sources.length} sources.`);

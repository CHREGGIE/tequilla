// scripts/seed-learn.ts
//
// Seeds the initial six editorial entries into public.learn_entries.
//
// Idempotent: upserts by slug. Safe to re-run after editing the entries below.
//
// Run: npm run learn:seed

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

type Entry = {
  slug: string;
  title: string;
  kind: 'term' | 'guide' | 'people';
  excerpt: string;
  body_md: string;
  related_slugs: string[];
  display_order: number;
};

const entries: Entry[] = [
  {
    slug: 'nom-numbers',
    title: 'What is a NOM number?',
    kind: 'term',
    display_order: 1,
    excerpt:
      'NOM stands for Norma Oficial Mexicana — a unique number assigned by the Mexican government to each certified tequila distillery. Bottles with the same NOM share a producer, even when the brands differ.',
    related_slugs: ['additive-free-tequila', 'tequila-regulations'],
    body_md: `NOM stands for *Norma Oficial Mexicana*, a unique number assigned by the Mexican government to each certified tequila distillery. It tells you exactly where the tequila was made.

You'll find the NOM on every bottle of real tequila — usually in small print on the back label. Tequilas with the same NOM number come from the same distillery, even if the brands are completely different. NOM 1139, for example, is La Alteña, the home of both El Tesoro and Tapatio. NOM 1146 is La Fortaleza, where the Sauza family roots run deep but the Fortaleza brand is made by traditional methods that the rest of the industry walked away from decades ago.

Knowing a tequila's NOM is one of the fastest ways to learn who's actually behind your bottle, separate marketing from production, and find producers whose work you trust.`,
  },

  {
    slug: 'additive-free-tequila',
    title: 'What does "additive-free" mean?',
    kind: 'term',
    display_order: 2,
    excerpt:
      'Tequilas labeled "100% agave" can legally include additives — sweeteners, flavorings, glycerin, oak extract — as long as they stay under 1% of the bottle. Additive-free tequila uses none of those.',
    related_slugs: ['nom-numbers', 'tequila-regulations', 'types-of-tequila'],
    body_md: `Tequilas labeled *100% agave* can legally include additives — sweeteners, flavorings, glycerin, caramel coloring, oak extract — as long as the total stays under 1% of the bottle. None of it has to be disclosed on the label.

Additive-free tequila uses none of those. The flavor comes entirely from the agave, the fermentation, and (for aged expressions) time in the barrel. What you taste is what the producer chose to do, not what a flavoring lab added to make the bottle taste consistent.

Many of the most respected tequilas in the category are proudly additive-free. It's not a marketing claim that any brand can self-apply — independent verification through the [Tequila Matchmaker additive-free program](https://www.tequilamatchmaker.com/) is the de facto industry standard. When we mark a bottle as additive-free on Tequillist, it's because we've cross-referenced it against that list.`,
  },

  {
    slug: 'how-tequila-is-made',
    title: 'How is tequila made?',
    kind: 'guide',
    display_order: 3,
    excerpt:
      'From mature blue Weber agave to bottled tequila in seven steps: harvest, cook, crush, ferment, distill, age, bottle. The choices a producer makes at each step define the bottle\'s character.',
    related_slugs: ['types-of-tequila', 'tequila-regulations', 'nom-numbers'],
    body_md: `Tequila is made from blue Weber agave plants, grown almost entirely in the Mexican state of Jalisco. Every bottle goes through roughly the same seven steps, but every producer makes different choices along the way — and those choices are most of what you taste.

1. **Harvesting.** Mature agave plants (usually six to eight years old) are cut down by hand. The leaves are stripped off and the heart of the plant — the *piña* — is hauled to the distillery. A good piña can weigh fifty to a hundred pounds.

2. **Cooking.** The piñas are cooked to convert their starches into fermentable sugars. Traditional producers use brick ovens (*hornos*) and cook slowly over 24 to 36 hours. Industrial producers use stainless-steel autoclaves and finish in a few hours. The slow methods extract caramelized, almost honeyed flavors; the fast methods extract sugars more efficiently but with less character.

3. **Crushing.** Cooked agave is crushed to extract the sweet juice (*mosto*). Most distilleries use mechanical roller mills. A few traditionalists still use the *tahona* — a giant volcanic stone wheel that crushes the agave more gently and leaves more of the plant's fiber in the mosto, which carries through to fermentation.

4. **Fermentation.** The mosto ferments in open or closed tanks, sometimes with cultivated yeast, sometimes with the wild yeasts that live in the distillery. Open-air fermentation in wood vats produces the most complex flavors but is the hardest to control.

5. **Distillation.** Most tequila is distilled twice, in either copper pot stills or stainless-steel columns. Copper pulls out unwanted sulfur compounds and adds richness. Some producers distill a third time for a lighter style.

6. **Aging.** Blanco tequila skips aging entirely (or rests for less than two months). Reposado spends two to twelve months in oak. Añejo: one to three years. Extra añejo: more than three years. The wood matters as much as the time — most producers use ex-bourbon American oak, but increasingly experiment with French oak, sherry casks, and wine barrels.

7. **Bottling.** The tequila is filtered (gently, ideally) and bottled, sometimes with purified water added to bring the proof down to bottling strength. The best producers minimize filtration to preserve flavor and texture.

The fastest way to read a tequila is to start at step 2 and work down. If the bottle says brick oven, tahona, copper pot still — you're looking at traditional production. If it says autoclave, diffuser, column still — you're looking at industrial production. Both can make perfectly enjoyable tequila, but they taste like different things.`,
  },

  {
    slug: 'types-of-tequila',
    title: 'The different types of tequila',
    kind: 'term',
    display_order: 4,
    excerpt:
      'Blanco (unaged), Reposado (2–12 months in oak), Añejo (1–3 years), Extra Añejo (over 3 years), Cristalino (aged then filtered clear). Each style brings out different facets of the same agave.',
    related_slugs: ['how-tequila-is-made', 'additive-free-tequila'],
    body_md: `Tequila is classified by how long it has spent in the barrel. The categories are official, set by Mexico's tequila regulator, and apply to every bottle sold as tequila.

- **Blanco** (also called *silver* or *plata*). Unaged, or rested in stainless steel for less than two months. The purest expression of the agave and the producer's hand — there's no barrel to hide behind. The best test of a distillery's craft.

- **Reposado** (*rested*). Aged in oak for two to twelve months. Picks up gentle vanilla, caramel, and wood notes from the barrel while still showing the cooked agave underneath. The most popular category in Mexico.

- **Añejo** (*aged*). Aged in oak for one to three years. Richer, more oak-forward, with deeper caramel and dried-fruit notes. Best sipped neat.

- **Extra añejo** (*extra aged*). Aged for more than three years. Deep amber, often mistaken for whiskey or rum in a blind tasting. Luxurious and complex — usually priced to match.

- **Cristalino**. Aged tequila (typically añejo or extra añejo) that's been charcoal-filtered to remove the color from the wood. Marketed as the best of both worlds: smoothness of aged tequila with the clarity of blanco. In practice, the filtering strips a lot of the wood's character; many additive-free purists are skeptical of the category, since the smoothness often comes from sweeteners added back in.

A note on style: more aging is not "better." A great blanco from a serious producer beats a mediocre añejo every time. The category tells you what shelf to look on; the producer tells you what's in the bottle.`,
  },

  {
    slug: 'tequila-regulations',
    title: 'The rules that define real tequila',
    kind: 'term',
    display_order: 5,
    excerpt:
      'Real tequila must be made in Mexico (mostly Jalisco), use 100% blue Weber agave (or at least 51% in mixtos), and follow standards set by the CRT — the Tequila Regulatory Council.',
    related_slugs: ['nom-numbers', 'how-tequila-is-made', 'additive-free-tequila'],
    body_md: `Tequila is a *Denomination of Origin* product — like Champagne, Bourbon, or Cognac, the name is legally protected and only spirits made under specific conditions can carry it.

To be sold as tequila, the spirit must:

- Be made in Mexico, specifically in one of five permitted regions: all of Jalisco, plus designated municipalities in Nayarit, Tamaulipas, Michoacán, and Guanajuato.
- Be distilled from blue Weber agave (*Agave tequilana Weber, variedad azul*). At minimum, 51% of the fermentable sugars must come from blue Weber agave — these are called *mixtos*. Bottles labeled *100% agave* must use blue Weber agave exclusively.
- Be produced under the supervision of the [Consejo Regulador del Tequila (CRT)](https://www.crt.org.mx/), the industry's regulatory council. Every certified distillery is registered with the CRT and assigned a [NOM number](/learn/nom-numbers).
- Be bottled within the denomination of origin if it's labeled 100% agave (mixto can be exported in bulk and bottled abroad).

The CRT's standards cover production methods, alcohol content (35–55% ABV depending on category), labeling requirements, and the audit process. A bottle without CRT certification cannot legally be sold as tequila — anywhere in the world that respects the DO, which is most of it.

The rules don't, however, cover everything aficionados care about. Use of additives, diffusers, or industrial shortcuts is permitted within limits. That's why programs like the additive-free certification exist — to mark the producers who go beyond the legal minimum.`,
  },

  {
    slug: 'the-camarena-family',
    title: 'The Camarena family',
    kind: 'people',
    display_order: 6,
    excerpt:
      "One of tequila's most respected dynasties. Multiple generations producing traditional tequila at La Alteña (El Tesoro, Tapatio) and El Pandillo (G4, Pasote).",
    related_slugs: ['how-tequila-is-made', 'additive-free-tequila'],
    body_md: `The Camarena family is one of tequila's most respected production dynasties. For generations they've made traditional, additive-free tequila in the highlands of Jalisco — the part of the industry that didn't take the industrial shortcut.

The story is most famously told through two distilleries.

**La Alteña** (NOM 1139), founded in 1937 by Don Felipe Camarena Hernández in Arandas, is the home of *Tapatio* and *El Tesoro*. The family has run it for three generations. Production is fully traditional: brick-oven cooking, tahona crushing (still in regular use), open-air fermentation, copper pot stills. Carlos Camarena, the current master distiller, has become one of the most recognized advocates for traditional methods worldwide.

**El Pandillo** (NOM 1579), founded by Carlos's brother Felipe "Don Felipe" Camarena in Jesús María, makes *G4* and *Pasote*. Don Felipe is famous in the industry for his engineering — he built a lot of the equipment at El Pandillo himself, including a system that captures rainwater for the entire production. G4 specifically is named for the four generations of Camarenas who've made tequila.

Between them, the Camarena distilleries produce some of the most acclaimed additive-free tequila in the world. If you're drinking Tapatio, El Tesoro, G4, or Pasote, you're drinking the result of nearly a century of one family's commitment to making tequila the slow way.`,
  },
];

async function main() {
  console.log(`Seeding ${entries.length} learn entries...`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const e of entries) {
    const { data: existing } = await supabase
      .from('learn_entries')
      .select('id')
      .eq('slug', e.slug)
      .maybeSingle();

    const { error } = await supabase
      .from('learn_entries')
      .upsert(e, { onConflict: 'slug' });

    if (error) {
      console.error(`  Failed: ${e.slug}: ${error.message}`);
      errors++;
    } else if (existing) {
      console.log(`  Updated: ${e.slug}`);
      updated++;
    } else {
      console.log(`  Created: ${e.slug}`);
      created++;
    }
  }

  console.log('');
  console.log(`Done. Created: ${created}. Updated: ${updated}. Errors: ${errors}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

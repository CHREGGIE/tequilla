import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { seedProducers, seedRecipes } from "./seed-data";
import { slugify } from "../src/lib/utils";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log("Seeding Tequilla database...");

  const tequilaSlugToId = new Map<string, string>();

  for (const producer of seedProducers) {
    const { data: existingProducer } = await supabase
      .from("producers")
      .select("id")
      .eq("name", producer.name)
      .maybeSingle();

    let producerId = existingProducer?.id;

    if (!producerId) {
      const { data, error } = await supabase
        .from("producers")
        .insert({
          name: producer.name,
          region: producer.region,
          description: producer.description,
          website: producer.website ?? null,
        })
        .select("id")
        .single();

      if (error) throw error;
      producerId = data.id;
      console.log(`  + Producer: ${producer.name}`);
    }

    for (const tequila of producer.tequilas) {
      const slug = slugify(`${producer.name}-${tequila.name}`);

      const { data: existingTequila } = await supabase
        .from("tequilas")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      let tequilaId = existingTequila?.id;

      const payload = {
        producer_id: producerId,
        name: tequila.name,
        slug,
        type: tequila.type,
        description: tequila.description,
        additive_free: tequila.additive_free,
        organic: tequila.organic,
        agave_region: tequila.agave_region,
        abv: tequila.abv,
        production_volume: tequila.production_volume,
        noma: producer.noma === "Various" ? null : producer.noma,
        price_range: tequila.price_range,
        price_min: tequila.price_min,
        price_max: tequila.price_max,
        tasting_notes: tequila.tasting_notes,
        featured: tequila.featured ?? false,
      };

      if (tequilaId) {
        const { error } = await supabase
          .from("tequilas")
          .update(payload)
          .eq("id", tequilaId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("tequilas")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        tequilaId = data.id;
        console.log(`  + Tequila: ${tequila.name}`);
      }

      tequilaSlugToId.set(tequila.name, tequilaId);

      if (tequila.editions?.length) {
        for (const edition of tequila.editions) {
          const { data: existingEdition } = await supabase
            .from("tequila_editions")
            .select("id")
            .eq("tequila_id", tequilaId)
            .eq("name", edition.name)
            .maybeSingle();

          if (!existingEdition) {
            const { error } = await supabase.from("tequila_editions").insert({
              tequila_id: tequilaId,
              name: edition.name,
              description: edition.description,
              limited_edition: edition.limited_edition,
            });
            if (error) throw error;
          }
        }
      }
    }
  }

  for (const recipe of seedRecipes) {
    const { data: existingRecipe } = await supabase
      .from("recipes")
      .select("id")
      .eq("slug", recipe.slug)
      .maybeSingle();

    let recipeId = existingRecipe?.id;

    const recipePayload = {
      name: recipe.name,
      slug: recipe.slug,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      difficulty: recipe.difficulty,
    };

    if (recipeId) {
      const { error } = await supabase
        .from("recipes")
        .update(recipePayload)
        .eq("id", recipeId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("recipes")
        .insert(recipePayload)
        .select("id")
        .single();
      if (error) throw error;
      recipeId = data.id;
      console.log(`  + Recipe: ${recipe.name}`);
    }

    const tequilaId = tequilaSlugToId.get(recipe.tequilaMatch);
    if (tequilaId) {
      const { error } = await supabase.from("recipe_tequilas").upsert(
        {
          recipe_id: recipeId,
          tequila_id: tequilaId,
          note: recipe.note ?? null,
        },
        { onConflict: "recipe_id,tequila_id" },
      );
      if (error) throw error;
    }
  }

  const { count } = await supabase
    .from("tequilas")
    .select("*", { count: "exact", head: true });

  console.log(`\nDone! ${count ?? 0} tequilas in database.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

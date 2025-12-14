const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function pickFilms(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.films)) return data.films;
  if (Array.isArray(data.data)) return data.data;
  throw new Error(
    'Не удалось понять структуру mongodb_initial_stub.json: ожидал массив или поле items/films/data',
  );
}

async function main() {
  const filePath = path.join(__dirname, 'mongodb_initial_stub.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const films = pickFilms(parsed);

  // Соединение берём из env
  const client = new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 5432),
    database: process.env.DATABASE_NAME || 'afisha',
    user: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || undefined,
  });

  await client.connect();

  await client.query('BEGIN');
  try {
    await client.query('DELETE FROM "schedule";');
    await client.query('DELETE FROM "films";');

    // Вставка фильмов
    const filmInsertSql = `
      INSERT INTO "films" ("id","title","about","description","director","rating","tags","image","cover")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `;

    // Вставка сеансов
    const schedInsertSql = `
      INSERT INTO "schedule" ("id","daytime","hall","rows","seats","price","taken","filmId")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;

    let filmsCount = 0;
    let schedulesCount = 0;

    for (const f of films) {
      // Нормализуем поля под схему
      const film = {
        id: String(f.id),
        title: String(f.title ?? ''),
        about: String(f.about ?? ''),
        description: String(f.description ?? ''),
        director: String(f.director ?? ''),
        rating: Number(f.rating ?? 0),
        tags: Array.isArray(f.tags) ? f.tags.map(String) : [],
        image: String(f.image ?? ''),
        cover: String(f.cover ?? ''),
        schedule: Array.isArray(f.schedule) ? f.schedule : [],
      };

      await client.query(filmInsertSql, [
        film.id,
        film.title,
        film.about,
        film.description,
        film.director,
        film.rating,
        film.tags,
        film.image,
        film.cover,
      ]);
      filmsCount += 1;

      for (const s of film.schedule) {
        const taken = Array.isArray(s.taken) ? s.taken.map(String) : [];
        await client.query(schedInsertSql, [
          String(s.id),
          String(s.daytime ?? ''),
          Number(s.hall ?? 0),
          Number(s.rows ?? 0),
          Number(s.seats ?? 0),
          Number(s.price ?? 0),
          taken,
          film.id,
        ]);
        schedulesCount += 1;
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Seed complete: films=${filmsCount}, schedules=${schedulesCount}`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});

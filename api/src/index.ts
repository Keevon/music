import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
const pdf = require("pdf-thumbnail");
import { Client } from "pg";
import { PassThrough } from "stream";

const PORT = process.env.PORT || 3001;

const client = new Client({
  password: "postgres",
  user: "postgres",
  host: "postgres"
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.get("/ping", async (req, res) => {
  try {
    await client.query("SELECT * FROM music LIMIT 1;");
  } catch (e) {
    await client.query(
      "CREATE TABLE music (id serial PRIMARY KEY, name text, title text, composer text, arranger text, album text, game text);"
    );
  }
  const database = await client
    .query("SELECT * FROM music LIMIT 1;")
    .then(() => "up")
    .catch(() => "down");

  res.send({
    environment: process.env.NODE_ENV,
    database
  });
});

app.get("/drop", async (req, res) => {
  await client.query("DROP TABLE music");

  res.send({
    success: true
  });
});

app.get("/api/get", async (req, res) => {
  const result = await client.query(
    "SELECT id, name, title, composer, arranger, album, game FROM music"
  );
  res.send({
    rows: result.rows
  });
});

app.get("/api/get/:id", async (req, res) => {
  const result = await client.query(
    "SELECT name, title, composer, arranger, album, game FROM music WHERE id = $1",
    [req.params.id]
  );
  res.send(result.rows[0]);
});

app.get("/api/music/:id", async (req, res) => {
  const readStream = fs.createReadStream(getMusicPath(req.params.id));
  readStream.pipe(res);
});

app.get("/api/preview/:id", async (req, res) => {
  const readStream = fs.createReadStream(getPreviewPath(req.params.id));
  readStream.pipe(res);
});

app.post("/api/upload", async (req, res) => {
  if (!req.files) {
    return res.sendStatus(400);
  }
  const file =
    req.files.file instanceof Array ? req.files.file[0] : req.files.file;
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO music(name, title, composer, arranger, album, game) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        file.name,
        req.body.title,
        req.body.composer,
        req.body.arranger,
        req.body.album,
        req.body.game
      ]
    );
    const row = result.rows[0];
    const id = row.id;
    const promises: Promise<void>[] = [
      file.mv(getMusicPath(id)),
      new Promise<void>(async res => {
        const data: PassThrough = await pdf(file.data);
        await createPreview(data, id);
        res();
      })
    ];
    await Promise.all(promises);
    await client.query("COMMIT");
    return res.send({
      row,
      params: req.body,
      success: true
    });
  } catch (e) {
    console.error(e);
    await client.query("ROLLBACK");
    return res.status(400).send({
      error: e,
      success: false
    });
  }
});

(async () => {
  await client.connect();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();

const createPreview = async (data: PassThrough, id: string): Promise<void> => {
  return new Promise((res, rej) => {
    const writeStream = fs.createWriteStream(getPreviewPath(id));
    writeStream
      .on("open", () => data.pipe(writeStream))
      .on("error", () => rej("Error writing preview"))
      .on("finish", () => res());
  });
};

const getMusicPath = (id: string): string => {
  return `/music/${id}.pdf`;
};

const getPreviewPath = (id: string): string => {
  return `/preview/${id}.jpg`;
};

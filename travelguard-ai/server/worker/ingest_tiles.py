#!/usr/bin/env python3
import os
import math
import json
import csv
import time
import psycopg2
from datetime import datetime, timezone
import h3


DB_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/travelguard?sslmode=disable')
H3_RES = int(os.environ.get('H3_RES', '8'))
TAU_DAYS = float(os.environ.get('TAU_DAYS', '7.0'))


def recency_decay(ts: datetime, now: datetime) -> float:
    age_days = (now - ts).total_seconds() / 86400.0
    return math.exp(-age_days / TAU_DAYS)


def load_feed(path: str):
    if path.endswith('.json'):
        with open(path, 'r') as f:
            data = json.load(f)
            for row in data:
                yield row
    elif path.endswith('.csv'):
        with open(path, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                yield row
    else:
        raise ValueError('Unsupported feed format')


def main():
    feed_path = os.environ.get('INCIDENT_FEED', 'incidents.json')
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    now = datetime.now(timezone.utc)
    weights = {}

    for row in load_feed(feed_path):
        try:
            itype = row.get('type')
            severity = int(row.get('severity', 1))
            ts = datetime.fromisoformat(row.get('timestamp'))
            lat = float(row.get('lat'))
            lon = float(row.get('lon'))
        except Exception:
            continue
        cell = h3.geo_to_h3(lat, lon, H3_RES)
        w = severity * recency_decay(ts, now)
        weights[cell] = weights.get(cell, 0.0) + w

    if not weights:
        print('No records ingested.')
        return

    max_w = max(weights.values())
    tiles = []
    for cell, w in weights.items():
        score = 100 - int(100 * (w / max_w))  # higher weight -> lower score
        tiles.append((cell, score, float(score), json.dumps({"w": w})))

    cur.executemany(
        """
        INSERT INTO "TileH3" (id, h3, score, "scoreFloat", counts, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), %s, %s, %s, %s, NOW(), NOW())
        ON CONFLICT (h3) DO UPDATE SET score = EXCLUDED.score, "scoreFloat" = EXCLUDED."scoreFloat", counts = EXCLUDED.counts, "updatedAt" = NOW()
        """,
        [(h3_id, score, score_float, counts) for (h3_id, score, score_float, counts) in tiles],
    )
    conn.commit()
    cur.close()
    conn.close()
    print(f'Upserted {len(tiles)} tiles at res {H3_RES}')


if __name__ == '__main__':
    main()


/opt/homebrew/bin/python3
./server/main.py
from __future__ import annotations

from datetime import datetime, timezone
import csv
import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "leads.sqlite"
CSV_PATH = DATA_DIR / "leads.csv"


class LeadPayload(BaseModel):
    ts: Optional[str] = Field(default=None)
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: Optional[str] = None
    currentIncome: Optional[str] = None
    targetIncome: Optional[str] = None
    objection: Optional[str] = None
    source: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None
    referrer: Optional[str] = None


def ensure_storage() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                current_income TEXT,
                target_income TEXT,
                objection TEXT,
                source TEXT,
                utm_source TEXT,
                utm_medium TEXT,
                utm_campaign TEXT,
                utm_term TEXT,
                utm_content TEXT,
                referrer TEXT
            )
            """
        )
    if not CSV_PATH.exists():
        with CSV_PATH.open("w", newline="", encoding="utf-8") as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(
                [
                    "ts",
                    "name",
                    "email",
                    "phone",
                    "current_income",
                    "target_income",
                    "objection",
                    "source",
                    "utm_source",
                    "utm_medium",
                    "utm_campaign",
                    "utm_term",
                    "utm_content",
                    "referrer",
                ]
            )


ensure_storage()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_timestamp(value: Optional[str]) -> datetime:
    if value:
        try:
            parsed = datetime.fromisoformat(value)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Invalid timestamp format") from exc
    return datetime.now(timezone.utc)


def insert_lead(ts_iso: str, payload: LeadPayload) -> None:
    record = (
        ts_iso,
        payload.name.strip(),
        payload.email,
        payload.phone or "",
        payload.currentIncome or "",
        payload.targetIncome or "",
        payload.objection or "",
        payload.source or "",
        payload.utm_source or "",
        payload.utm_medium or "",
        payload.utm_campaign or "",
        payload.utm_term or "",
        payload.utm_content or "",
        payload.referrer or "",
    )
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO leads (
                ts,
                name,
                email,
                phone,
                current_income,
                target_income,
                objection,
                source,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_term,
                utm_content,
                referrer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            record,
        )
    with CSV_PATH.open("a", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(record)


@app.get("/api/health")
def health() -> dict[str, object]:
    return {"ok": True, "ts": int(datetime.now(timezone.utc).timestamp())}


@app.post("/api/lead")
def create_lead(payload: LeadPayload) -> dict[str, object]:
    received_at = parse_timestamp(payload.ts)
    ts_iso = received_at.astimezone(timezone.utc).isoformat()
    if not payload.name.strip():
        raise HTTPException(status_code=422, detail="Name is required")
    insert_lead(ts_iso, payload)
    return {"ok": True, "ts": ts_iso}

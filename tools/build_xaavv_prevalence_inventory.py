#!/usr/bin/env python3
"""Build a prevalence-ranked XAAVV term/name inventory from public search pages.

This script is intentionally dependency-free (stdlib only) so it is easy to rerun.
It crawls selected XAAVV search terms across multiple pages, extracts content titles,
then derives:
- handles/names (bracketed aliases, @mentions, explicit latin handles)
- prevalent terms (Chinese phrases + latin tokens) with frequency counts
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
import time
from collections import Counter
from pathlib import Path
from typing import Iterable
from urllib.parse import quote
from urllib.request import Request, urlopen

BASE_URL = "https://www.xaavv.com"

# Seed terms chosen from XAAVV-visible high-signal tags and related body/genre terms.
SEED_SEARCH_TERMS = [
    "TS", "伪娘", "人妖", "女装", "男娘", "异装",
    "美腿", "美臀", "美乳", "爆乳", "巨乳", "奶子", "乳头", "白虎",
    "玉足", "足交", "腋窝", "锁骨", "肩膀", "后庭", "网黄", "福利姬",
    "onlyfans", "cos", "coser", "里番", "中出", "内射", "潮吹", "捆缚",
]

CONTENT_LINK_RE = re.compile(
    r'<a[^>]+href="(?P<href>/xaavv/[^"]+)"[^>]*>(?P<inner>.*?)</a>',
    re.IGNORECASE | re.DOTALL,
)

CJK_CHUNK_RE = re.compile(r"[\u4e00-\u9fff]{2,12}")
LATIN_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z0-9_]{2,30}")
AT_HANDLE_RE = re.compile(r"@([A-Za-z0-9_]{3,40})")
BRACKET_NAME_RE = re.compile(r"【([^】]{1,40})】")

LATIN_STOPWORDS = {
    "china", "chinese", "jav", "av", "full", "hd", "of", "onlyfans", "cos", "coser",
    "the", "and", "for", "with", "from", "part", "episode", "season", "new", "top",
    "video", "uncensored", "original", "source", "free", "download", "preview", "site",
    "http", "https", "www", "com", "file", "title", "author", "posts", "brand", "size",
    "purchasing", "here", "mbsupport", "snos", "mida", "ppv", "fc2", "dass",
}

CJK_STOPWORDS = {
    "中国", "国语", "高清", "原版", "无水印", "最新", "极品", "精品", "推荐", "免费", "小姐姐",
    "视频", "福利视频", "国产", "日本", "动漫", "欧美", "全集", "上篇", "下篇", "第二季", "合集",
    "露脸", "偷拍", "私拍", "原创", "福利", "网红", "大神", "女神", "尤物", "颜值", "骚妹",
    "販売日", "容量", "日语", "英语", "原版首发", "原版无水印",
}


def fetch_html(url: str, timeout: int = 30) -> str:
    req = Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/123.0.0.0 Safari/537.36"
            )
        },
    )
    with urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strip_tags(raw_html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", raw_html)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def iter_search_urls(seed_terms: Iterable[str], max_pages: int) -> Iterable[tuple[str, int, str]]:
    for term in seed_terms:
        encoded = quote(term)
        for page in range(1, max_pages + 1):
            if page == 1:
                url = f"{BASE_URL}/search/{encoded}"
            else:
                url = f"{BASE_URL}/search/{encoded}?page={page}"
            yield term, page, url


def extract_titles(html_text: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    seen = set()
    for m in CONTENT_LINK_RE.finditer(html_text):
        href = m.group("href")
        title = strip_tags(m.group("inner"))
        if not title:
            continue
        key = (href, title)
        if key in seen:
            continue
        seen.add(key)
        out.append({"href": href, "title": title})
    return out


def normalize_handle(raw: str) -> str:
    val = raw.strip().strip("@")
    val = re.sub(r"\s+", "", val)
    return val


def collect_handles(title: str) -> list[str]:
    handles = []
    for m in AT_HANDLE_RE.finditer(title):
        h = normalize_handle(m.group(1))
        if 3 <= len(h) <= 40:
            handles.append(h)

    for m in BRACKET_NAME_RE.finditer(title):
        candidate = normalize_handle(m.group(1))
        if not candidate:
            continue
        # Keep short CJK/latin aliases and mixed aliases seen in titles.
        if 1 <= len(candidate) <= 24:
            handles.append(candidate)

    # Common explicit latin handles in text without @, e.g. lucymoch, Nicolove.
    for token in LATIN_TOKEN_RE.findall(title):
        t = token.strip()
        if len(t) < 4:
            continue
        low = t.lower()
        if low in LATIN_STOPWORDS:
            continue
        if re.search(r"\d{4}", t):
            continue
        handles.append(t)

    # Preserve order while deduping.
    deduped = []
    seen = set()
    for h in handles:
        k = h.lower()
        if k in seen:
            continue
        seen.add(k)
        deduped.append(h)
    return deduped


def collect_terms(title: str) -> list[str]:
    terms = []

    for cjk in CJK_CHUNK_RE.findall(title):
        if cjk in CJK_STOPWORDS:
            continue
        terms.append(cjk)

    for token in LATIN_TOKEN_RE.findall(title):
        low = token.lower()
        if low in LATIN_STOPWORDS:
            continue
        if token.isdigit():
            continue
        terms.append(low)

    deduped = []
    seen = set()
    for term in terms:
        if term in seen:
            continue
        seen.add(term)
        deduped.append(term)
    return deduped


def to_ranked(counter: Counter[str], minimum_count: int = 1) -> list[dict[str, int | str]]:
    ranked = []
    for item, count in counter.most_common():
        if count < minimum_count:
            continue
        ranked.append({"item": item, "count": count})
    return ranked


def write_markdown(
    out_path: Path,
    generated_at: str,
    max_pages: int,
    seed_terms: list[str],
    fetched_pages: int,
    failed_pages: int,
    unique_titles: int,
    ranked_terms: list[dict[str, int | str]],
    ranked_handles: list[dict[str, int | str]],
) -> None:
    total_unique_entries = len(ranked_terms) + len(ranked_handles)

    lines = []
    lines.append("# XAAVV Prevalence Inventory")
    lines.append("")
    lines.append(f"Generated: {generated_at} UTC")
    lines.append("")
    lines.append("## Method")
    lines.append("")
    lines.append("1. Crawl public XAAVV search pages for seeded high-signal terms.")
    lines.append("2. Extract content title text from /xaavv/*.html result links.")
    lines.append("3. Derive candidate terms and handles from title text.")
    lines.append("4. Rank by frequency (prevalence on target website).")
    lines.append("")
    lines.append("## Crawl Parameters")
    lines.append("")
    lines.append(f"- Seed terms: {len(seed_terms)}")
    lines.append(f"- Pages per term: {max_pages}")
    lines.append(f"- Page fetches attempted: {len(seed_terms) * max_pages}")
    lines.append(f"- Page fetches succeeded: {fetched_pages}")
    lines.append(f"- Page fetches failed: {failed_pages}")
    lines.append(f"- Unique titles harvested: {unique_titles}")
    lines.append(f"- Unique prevalent terms: {len(ranked_terms)}")
    lines.append(f"- Unique handles/names: {len(ranked_handles)}")
    lines.append(f"- Total unique term+name entries: {total_unique_entries}")
    lines.append("")
    lines.append("## Seed Terms")
    lines.append("")
    lines.append(", ".join(seed_terms))
    lines.append("")
    lines.append("## Top 200 Terms by Prevalence")
    lines.append("")
    for row in ranked_terms[:200]:
        lines.append(f"- {row['item']} ({row['count']})")
    lines.append("")
    lines.append("## Top 200 Handles/Names by Prevalence")
    lines.append("")
    for row in ranked_handles[:200]:
        lines.append(f"- {row['item']} ({row['count']})")
    lines.append("")
    lines.append("## Reproduction")
    lines.append("")
    lines.append("```powershell")
    lines.append("Set-Location 'C:\\Users\\purpl\\Documents\\xaavv-dark-kiro-tampermonkey'")
    lines.append("python tools/build_xaavv_prevalence_inventory.py --pages 8")
    lines.append("```")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages", type=int, default=8, help="Pages per seed term")
    parser.add_argument("--sleep-ms", type=int, default=150, help="Delay between requests")
    parser.add_argument("--out-json", default="data/xaavv_prevalence_inventory.json")
    parser.add_argument("--out-md", default="data/XAAVV_PREVALENCE_INVENTORY.md")
    args = parser.parse_args()

    seed_terms = list(SEED_SEARCH_TERMS)

    titles_by_href: dict[str, str] = {}
    fetched_pages = 0
    failed_pages = 0

    for term, page, url in iter_search_urls(seed_terms, args.pages):
        try:
            page_html = fetch_html(url)
            fetched_pages += 1
            for item in extract_titles(page_html):
                titles_by_href[item["href"]] = item["title"]
        except Exception as exc:  # pragma: no cover - operational fallback
            failed_pages += 1
            print(f"WARN fetch failed term={term} page={page} url={url} err={exc}", file=sys.stderr)
        time.sleep(max(args.sleep_ms, 0) / 1000.0)

    term_counter: Counter[str] = Counter()
    handle_counter: Counter[str] = Counter()

    for title in titles_by_href.values():
        term_counter.update(collect_terms(title))
        handle_counter.update(collect_handles(title))

    ranked_terms = to_ranked(term_counter, minimum_count=1)
    ranked_handles = to_ranked(handle_counter, minimum_count=1)

    generated_at = dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    payload = {
        "generated_at_utc": generated_at,
        "base_url": BASE_URL,
        "seed_terms": seed_terms,
        "pages_per_term": args.pages,
        "attempted_pages": len(seed_terms) * args.pages,
        "fetched_pages": fetched_pages,
        "failed_pages": failed_pages,
        "unique_titles": len(titles_by_href),
        "counts": {
            "unique_terms": len(ranked_terms),
            "unique_handles": len(ranked_handles),
            "total_unique_term_plus_name_entries": len(ranked_terms) + len(ranked_handles),
        },
        "top_terms": ranked_terms,
        "top_handles": ranked_handles,
        "titles": [{"href": href, "title": title} for href, title in sorted(titles_by_href.items())],
    }

    out_json = Path(args.out_json)
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    out_md = Path(args.out_md)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    write_markdown(
        out_path=out_md,
        generated_at=generated_at,
        max_pages=args.pages,
        seed_terms=seed_terms,
        fetched_pages=fetched_pages,
        failed_pages=failed_pages,
        unique_titles=len(titles_by_href),
        ranked_terms=ranked_terms,
        ranked_handles=ranked_handles,
    )

    total_unique = len(ranked_terms) + len(ranked_handles)
    print(
        f"OK fetched_pages={fetched_pages} failed_pages={failed_pages} "
        f"unique_titles={len(titles_by_href)} unique_terms={len(ranked_terms)} "
        f"unique_handles={len(ranked_handles)} total_unique_entries={total_unique}"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

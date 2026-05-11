# XAAVV Site Term Research v1.2.45

## Scope

This note records public-site term research gathered directly from XAAVV search pages on 2026-05-11 and used to normalize dictionary entries toward the wording XAAVV itself surfaces most often.

Translation policy: choose translated terms by prevalence on the target website (XAAVV) first, and only use generic dictionary synonyms as fallback.

No third-party credentials were written into this file.

## Reproducible Method (Prevalence-First)

1. Start from the source keyword that needs localization (for example: `boob`, `armpit`, `ts`, `collarbone`).
2. Query XAAVV search pages directly for plausible Chinese candidates (`https://www.xaavv.com/search/<term>`).
3. Record result counts shown by XAAVV for each candidate term.
4. Rank terms by prevalence on XAAVV (highest recurring counts and frequent title/tag appearance win).
5. Build dictionary entries using top XAAVV-native terms first; keep broader synonyms only as secondary fallbacks.
6. Validate the userscript with `node --check` after dictionary edits.
7. Keep a dated research note with counts, chosen mappings, and rationale.

Reproduction command pattern used in this release:

```powershell
Set-Location 'C:\Users\purpl\Documents\xaavv-dark-kiro-tampermonkey'
node --check xaavv-master-automation-dark-mode-v1.2.45.user.js
```

Search evidence collection is reproducible by opening XAAVV term pages directly in the browser and copying the visible counts into this note.

## XAAVV Search Evidence

Observed direct XAAVV search counts:

- TS: 15363
- 美腿: 40811
- 美臀: 39478
- 美乳: 23464
- 巨乳: 15329
- 白虎: 3724
- 足交: 1715
- 乳头: 1536
- 伪娘: 1562
- 人妖: 1460
- 奶子: 1028
- 爆乳: 509
- 网黄: 456
- 福利姬: 150
- 腋窝: 64
- 后庭: 40
- 女装: 39
- 肩膀: 21
- 锁骨: 7

## Dictionary Normalization Decisions

Body-part and trait terms were aligned to the strongest XAAVV-native wording:

- boob / boobs / breast -> 巨乳 / 美乳 / 奶子
- armpit -> 腋窝 / 腋下
- collar / collarbone -> 锁骨 / 颈部
- leg / thigh -> 美腿 / 长腿 / 大腿
- foot -> 玉足 / 足交 / 美足
- shoulder -> 肩膀 / 锁骨
- waist -> 细腰 / 腰肢 / 腰
- belly -> 小腹 / 腹部 / 肚子
- butt / booty retained around 美臀 / 丰臀 / 翘臀

High-signal XAAVV-native tokens added for search matching:

- TS
- 男娘
- 异装
- 女装
- 人妖
- 伪娘
- 网黄
- 福利姬
- onlyfans / of
- 白虎
- 美乳
- 爆乳
- 美腿
- 美臀
- 玉足
- 足交
- 乳头
- 后庭

## Creator / Handle Candidates Seen Directly On XAAVV

These names were visible directly on XAAVV public pages and can be treated as site-sourced candidates for future dictionary or validation work:

- lucymoch
- Nicolove
- SLRabbit
- deerlong
- kitty
- Candylove
- herluckyfan
- EdMosaic
- 苏小涵
- Yuzukitty柚子猫
- 牛奶泡芙-唐可可
- FortuneCuttie-饼干姐姐
- 饼干姐姐
- Kovicki
- Miuzxc
- muyan
- 麻酥酥
- 菠萝啤BEER
- Tame凛
- 小水水
- im_xxjun
- aryminh
- Lilykoti
- cuteli
- 苏畅

## SimpCity Search Follow-up

Public fetches to the requested SimpCity search URLs returned HTTP 403.

Because the available tools here do not provide a safe authenticated browser workflow, the supplied credentials were not used in terminal commands or written into repo files. Using them through terminal-based requests would risk exposing them in command history or tool logs.

## Outcome

The v1.2.45 dictionary update is based on XAAVV-native wording rather than guessed synonyms, with emphasis on the body and site-specific labels that XAAVV visibly uses across search results and titles.
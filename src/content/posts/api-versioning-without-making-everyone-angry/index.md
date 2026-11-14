---
title: "API Versioning Without Making Everyone Angry"
excerpt: "Versioning is a communication problem first. The technical shape only works when consumers can predict what changes and when."
category: "Engineering"
date: 2026-07-06
author:
  name: "Evan Brooks"
  role: "Security and reliability"
cover:
  src: "./cover.jpg"
  alt: "Purple and blue abstract light streaks"
  creditName: "Credits to Wolfgang Vrede via Unsplash"
  creditUrl: "https://unsplash.com/photos/abstract-purple-and-blue-light-streaks-with-a-glass-orb-7HRu1KzpLjg"
featured: false
---

<picture class="responsive-picture">
  <source type="image/jxl" sizes="(min-width: 768px) 720px, 100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_200,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 200w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_697,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 697w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1048,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1048w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1265,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1265w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1561,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1561w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1757,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1757w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1944,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1944w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1997,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1997w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2000,q_auto,f_jxl/assets/images/daniel-begel-1g4IiRugWRc-unsplash 2000w" width="2000" height="3000">
  <source type="image/avif" sizes="(min-width: 768px) 720px, 100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_200,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 200w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_697,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 697w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1048,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1048w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1265,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1265w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1561,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1561w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1757,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1757w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1944,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1944w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1997,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1997w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2000,q_auto,f_avif/assets/images/daniel-begel-1g4IiRugWRc-unsplash 2000w" width="2000" height="3000">
  <source type="image/webp" sizes="(min-width: 768px) 720px, 100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_200,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 200w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_697,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 697w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1048,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1048w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1265,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1265w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1561,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1561w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1757,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1757w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1944,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1944w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1997,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1997w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2000,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 2000w" width="2000" height="3000">
  <img loading="lazy" decoding="async" src="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2000,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_200,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 200w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_697,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 697w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1048,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1048w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1265,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1265w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1561,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1561w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1757,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1757w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1944,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1944w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1997,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 1997w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2000,q_auto,f_webp/assets/images/daniel-begel-1g4IiRugWRc-unsplash 2000w" sizes="(min-width: 768px) 720px, 100vw" alt="TODO: describe this image" width="2000" height="3000">
</picture>


API versioning fails when it surprises people. A perfectly designed URL scheme cannot save a platform that changes behavior without warning, deprecates too aggressively, or leaves old versions alive with no support story.

The goal is not to avoid breaking changes forever. It is to make change survivable.

## Context

Public API consumers need predictable change windows, stable contracts, and clear migration paths. The existing informal approach works while consumers are close to the team, but becomes brittle as integrations grow.

## Decision

Use additive changes by default, reserve breaking changes for explicit version boundaries, and publish deprecation signals in documentation, response headers, and account communication.

## Alternatives

- Keep a single evergreen API and avoid explicit versions.
- Version every endpoint independently.
- Use date-based global versions for all behavior.

## Consequences

Consumers get a clearer contract, but the platform team must maintain version usage metrics and migration examples.

## Define what versioning protects

Does a version protect response shape, validation rules, authentication behavior, pagination, error codes, or all of the above? Write it down. Consumers need to know whether a field can appear, disappear, or change meaning.

Ambiguity turns every deploy into a compatibility risk.

## Make deprecation observable

Deprecation notices should show up in docs, dashboards, headers, and account communication. If a customer only learns about a breaking change when their integration fails, the process did not work.

Track usage by version and endpoint. That data tells you who needs help and whether a migration is realistic.

## Prefer additive change

Add fields, add endpoints, and add opt-in behavior before replacing existing contracts. When removal is necessary, provide migration examples that match real client code.

Developers forgive change more easily when the path forward is concrete.

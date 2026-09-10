---
title: "A Small Incident Review Template for Busy Teams"
excerpt: "A lightweight review format that helps teams learn from outages without turning every incident into a courtroom."
category: "Reliability"
date: 2026-07-03
author:
  name: "Evan Brooks"
  role: "Security and reliability"
cover:
  src: "./cover.jpg"
  alt: "Purple, white, and orange abstract light"
  creditName: "Credits to mymind via Unsplash"
  creditUrl: "https://unsplash.com/photos/purple-white-and-orange-light-tZCrFpSNiIQ"
featured: false
---

<cloudinary-picture
  src="v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08"
  alt="A hairdo"
  width="5472"
  height="3648"
  breakpoints="320,1208,1748,1979,2018,2296,2357,2400"
  sizes="100vw">
</cloudinary-picture>

Incident reviews fail when they are too heavy to run consistently. A small team does not need a fifty-question form after every alert. It needs a repeatable way to understand what happened, what helped, and what should change.

Use the smallest template that creates learning.

## What happened?

Write a timeline in plain language. Include detection, user impact, mitigation, recovery, and any confusing signals. Avoid turning the timeline into a debate about who should have known what.

The timeline is shared memory. Keep it factual.

## Why did it make sense at the time?

This question prevents blame from sneaking in through the side door. Engineers made decisions with the information they had. Capture that information, including dashboards, runbooks, assumptions, and alerts that were missing or noisy.

If a decision looks strange after the incident, that is usually where the system can improve.

<picture>
  <source
    type="image/jxl"
    srcset="
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_596/f_jxl/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.jxl 596w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1063/f_jxl/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.jxl 1063w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1360/f_jxl/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.jxl 1360w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1440/f_jxl/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.jxl 1440w"
    sizes="(max-width: 2400px) 60vw, 1440px"
  />
  <source
    type="image/avif"
    srcset="
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_596/f_avif/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.avif 596w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1063/f_avif/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.avif 1063w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1360/f_avif/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.avif 1360w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1440/f_avif/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.avif 1440w"
    sizes="(max-width: 2400px) 60vw, 1440px"
  />
  <source
    type="image/webp"
    srcset="
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_596/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 596w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1063/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1063w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1360/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1360w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1440/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1440w"
    sizes="(max-width: 2400px) 60vw, 1440px"
  />
  <img
    src="https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1440/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp"
    srcset="
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_596/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 596w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1063/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1063w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1360/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1360w,
    https://res.cloudinary.com/paulapplegate-com/image/upload/ar_16:9,c_fill,g_auto,q_auto/c_scale,w_1440/f_webp/v1789048006/breakpoints/t5uxdejiyr5jv0pc09t1.webp 1440w"
    sizes="(max-width: 2400px) 60vw, 1440px"
    alt=""
    loading="lazy"
    width="1440"
    height="810"
  />
</picture>

## What will we change?

Pick one to three actions. Each action needs an owner, a due date, and a reason. "Improve monitoring" is not an action. "Alert when queue age exceeds five minutes for ten minutes" is.

Reviews are not valuable because they produce documents. They are valuable because they make the next incident smaller, shorter, or easier to understand.

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

<picture class="responsive-picture">
  <source type="image/jxl" sizes="100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_320,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 320w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1208,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1208w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1748,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1748w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1979,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1979w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2018,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2018w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2296,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2296w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2357,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2357w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2400,q_auto,f_jxl/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2400w" width="2400" height="1600">
  <source type="image/avif" sizes="100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_320,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 320w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1208,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1208w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1748,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1748w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1979,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1979w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2018,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2018w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2296,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2296w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2357,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2357w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2400,q_auto,f_avif/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2400w" width="2400" height="1600">
  <source type="image/webp" sizes="100vw" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_320,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 320w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1208,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1208w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1748,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1748w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1979,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1979w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2018,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2018w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2296,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2296w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2357,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2357w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2400,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2400w" width="2400" height="1600">
  <img loading="lazy" decoding="async" src="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2400,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08" srcset="https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_320,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 320w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1208,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1208w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1748,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1748w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_1979,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 1979w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2018,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2018w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2296,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2296w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2357,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2357w, https://res.cloudinary.com/paulapplegate-com/image/upload/c_limit,w_2400,q_auto,f_webp/v1789004318/monograph/alina-chernovolova-S-LngVsRi04-unsplash-ca77b253d377a4aaf0f8ef08 2400w" sizes="100vw" alt="A hairdo" width="2400" height="1600">
</picture>

Incident reviews fail when they are too heavy to run consistently. A small team does not need a fifty-question form after every alert. It needs a repeatable way to understand what happened, what helped, and what should change.

Use the smallest template that creates learning.

## What happened?

Write a timeline in plain language. Include detection, user impact, mitigation, recovery, and any confusing signals. Avoid turning the timeline into a debate about who should have known what.

The timeline is shared memory. Keep it factual.

## Why did it make sense at the time?

This question prevents blame from sneaking in through the side door. Engineers made decisions with the information they had. Capture that information, including dashboards, runbooks, assumptions, and alerts that were missing or noisy.

If a decision looks strange after the incident, that is usually where the system can improve.

## What will we change?

Pick one to three actions. Each action needs an owner, a due date, and a reason. "Improve monitoring" is not an action. "Alert when queue age exceeds five minutes for ten minutes" is.

Reviews are not valuable because they produce documents. They are valuable because they make the next incident smaller, shorter, or easier to understand.

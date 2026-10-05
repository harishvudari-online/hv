# Instapost Requirements

Build an AI-powered Instagram daily content automation dashboard named **instapost** inside the existing application.

## Goal

Automatically plan, generate, validate, schedule, and publish one Instagram carousel post per day.

## Inputs

- Reference topics provided by the admin
- Reference thumbnail images provided by the admin
- Brand/style guidelines
- Instagram account publishing configuration
- Preferred daily posting time

## Daily Workflow

1. Select today's approved topic.
2. Research the topic using approved sources.
3. Generate an Instagram content strategy.
4. Generate an SEO-friendly title, hook, caption, CTA, and hashtags.
5. Generate approximately five carousel slides/images.
6. Use reference thumbnails as visual/style references.
7. Validate quality, duplicate checks, image readiness, and Instagram requirements.
8. Store generated images and metadata.
9. Wait for human approval in V1.
10. Schedule or publish through the Instagram Graph API.
11. Store the Instagram post ID.
12. Collect engagement metrics.
13. Use analytics to improve future posts.

## Admin Capabilities

- Add and prioritize topics
- Upload and review reference thumbnails
- Define image style, tone, CTA usage, and slide count
- Preview generated carousel content
- Approve, reject, or request regeneration
- Edit captions and hashtags
- Schedule posts
- View scheduled and published posts
- View analytics and quality status

## V1 Constraints

- Use a dashboard UI first, with human approval before publishing.
- Do not publish automatically until the quality workflow and API configuration are trusted.
- Use Meta's official Instagram Graph API for production publishing rather than password-based browser automation.
- Prevent duplicate topics and duplicate posts.
- Maintain a visible content calendar and status pipeline.

## Future Integrations

- AI research, content, image, SEO, quality, and publishing agents
- Cloud storage for generated carousel assets
- PostgreSQL or another persistent store for topics, posts, images, and analytics
- Vercel Cron, GitHub Actions, Cloud Scheduler, or EventBridge for production scheduling

## Current Repository Implementation

The dashboard lives at `/instapost` and opens from the `instapost` menu item.

V1 stores topics, reference thumbnails, generated carousel metadata, approvals, and simulated publish records in the browser. It generates a five-slide 1080×1350 carousel, caption, hashtags, and quality checks from the saved topic and reference style. Approval is required before scheduling or the local publish action. The local publish action records an Instagram-ready post ID and starter analytics, and it does not call Meta until server-side Instagram Graph API credentials are configured.

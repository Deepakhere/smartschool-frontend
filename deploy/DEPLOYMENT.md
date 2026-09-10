# Frontend deployment — S3 + CloudFront

Static build hosted on S3, served through CloudFront for free HTTPS
(`*.cloudfront.net` domain, no purchase needed) and a CDN in front of it.

## 1. S3 bucket (AWS Console → S3)

1. **Create bucket** → name it e.g. `smartschool-frontend-<yourname>` (bucket
   names are globally unique).
2. Keep **Block all public access** ON — the bucket stays private; CloudFront
   reaches it via Origin Access Control (OAC), not a public bucket policy.
3. Everything else default.

## 2. CloudFront distribution (AWS Console → CloudFront)

1. **Create distribution**.
2. Origin domain: pick your S3 bucket from the list (the console offers to
   set up OAC automatically — accept it, and accept updating the bucket
   policy it proposes).
3. Viewer protocol policy: **Redirect HTTP to HTTPS**.
4. Default root object: `index.html`.
5. **Error pages** (this is the part that's easy to miss and breaks routing):
   add two custom error responses —
   - HTTP error 403 → response page `/index.html` → response code `200`
   - HTTP error 404 → response page `/index.html` → response code `200`

   Without this, refreshing any route other than `/` (e.g.
   `/some-org-id/admin/students`) 404s, because S3 has no such object —
   React Router only ever sees `/` and resolves the rest client-side.
6. Create. Note the distribution's domain name, e.g.
   `d1234abcd.cloudfront.net` — that's your app's URL.

## 3. Build-time API URL

Update `.env.production` in this repo once the backend is deployed (see
`smartschool-backend/deploy/DEPLOYMENT.md`):

```
VITE_API_URL=https://3-4-5-6.sslip.io
```

And tell the backend about this CloudFront domain — set
`FRONTEND_URL=https://d1234abcd.cloudfront.net` (and/or `CORS_ORIGINS`) in the
backend's real running environment, so CORS allows it.

## 4. IAM user for GitHub Actions deploys

Create a dedicated IAM user (not root/admin keys) scoped to just this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::smartschool-frontend-<yourname>",
        "arn:aws:s3:::smartschool-frontend-<yourname>/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
    }
  ]
}
```

Generate an access key for this user (Security credentials → Access keys).

## 5. GitHub Actions secrets

Repo → Settings → Secrets and variables → Actions → add:
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — the IAM user's keys above
- `AWS_REGION` — e.g. `us-east-1`
- `S3_BUCKET` — `smartschool-frontend-<yourname>`
- `CLOUDFRONT_DISTRIBUTION_ID` — from the distribution's overview page

The `deploy` job in `.github/workflows/ci.yml` only runs after `test`/`build`
pass, and only on a push to `main`: builds with the real `.env.production`,
syncs `dist/` to S3, then invalidates CloudFront's cache so the new build is
served immediately instead of waiting out the CDN's cache TTL.

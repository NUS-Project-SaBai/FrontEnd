# CI/CD

1. [vercal-deployment.yml](/.github/workflows/vercel-deploy.yml) `--archive=tgz option`: uploads [compressed build output](https://vercel.com/docs/cli/deploy#when-not-to-use---prebuilt) instead of separate files to avoid hitting Vercel [free tier limits](https://community.vercel.com/t/vercel-cli-error-too-many-requests/14173). May take slightly longer to set up but is worth it for us.

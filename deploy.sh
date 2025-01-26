#!/bin/bash

# Exit on error
set -e

# Configuration
BUCKET_NAME="chain-of-good-ui"
DISTRIBUTION_ID="E3NEQRMV8X3QK4"
BUILD_DIR="dist"  # Or whatever your build directory is called

# Build the site
echo "Building site..."
npm run build

# Sync with S3
echo "Uploading to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "*.html" \
    --exclude "*.json"

# Upload HTML and JSON files with different cache settings
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --delete \
    --cache-control "no-cache,no-store,must-revalidate" \
    --include "*.html" \
    --include "*.json"

# Create CloudFront invalidation
echo "Creating CloudFront invalidation..."
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"

echo "Deployment complete!"
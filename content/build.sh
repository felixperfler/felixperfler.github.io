#!/bin/bash

# Local build script for testing
# Run this to manually generate publications.html from markdown

echo "Converting markdown to HTML..."

# Convert publications markdown to HTML
pandoc content/publications.md -t html --wrap=none > /tmp/publications_content.html

# Convert awards markdown to HTML  
pandoc content/awards.md -t html --wrap=none > /tmp/awards_content.html

# Read template
template=$(cat content/templates/publications.html)

# Replace placeholders
publications_html=$(cat /tmp/publications_content.html)
awards_html=$(cat /tmp/awards_content.html)

# Use sed to replace placeholders in template
echo "$template" | \
  sed "s|{{PUBLICATIONS_CONTENT}}|$(echo "$publications_html" | sed 's/|/\\|/g')|g" | \
  sed "s|{{AWARDS_CONTENT}}|$(echo "$awards_html" | sed 's/|/\\|/g')|g" > publications.html

echo "Generated publications.html successfully!"
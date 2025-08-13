#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter (basic subset)
function markdownToHTML(markdown) {
  return markdown
    // Headers
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    
    // Paragraphs and line breaks
    .split('\n\n')
    .map(block => {
      if (block.startsWith('<h') || block.startsWith('<hr')) {
        return block;
      }
      if (block.trim()) {
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
      }
      return '';
    })
    .join('\n');
}

// Convert publications to HTML with custom structure
function convertPublications(markdown) {
  const sections = markdown.split('---').map(s => s.trim()).filter(s => s);
  
  return sections.map(section => {
    if (section.startsWith('# Publications')) return '';
    
    const lines = section.split('\n').filter(l => l.trim());
    if (lines.length < 3) return '';
    
    const title = lines[0].replace(/^## /, '');
    const authors = lines[1].replace(/^\*\*Authors:\*\* /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const venue = lines[2].replace(/^\*\*Venue:\*\* /, '');
    const links = lines[3] ? lines[3].replace(/^\*\*Links:\*\* /, '').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">[$1]</a>').replace(/\|/g, ' ') : '';
    
    return `<div class="publication">
    <p><strong>${title}</strong></p>
    <p>${authors}</p>
    <p>${venue}</p>
    <p>
        ${links}
    </p>
</div>`;
  }).join('\n');
}

// Convert awards to HTML with custom structure  
function convertAwards(markdown) {
  const sections = markdown.split('---').map(s => s.trim()).filter(s => s);
  
  let result = '<h1>Grants and Awards</h1>\n';
  
  sections.forEach(section => {
    if (section.startsWith('# Grants and Awards')) return;
    
    const lines = section.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    
    const title = lines[0].replace(/^## /, '');
    const description = lines.slice(1).join(' ');
    
    result += `    <div class="award-item">
        <p><strong>${title}</strong></p>
        <p>${description}</p>
    </div>\n`;
  });
  
  return result;
}

try {
  console.log('Converting markdown to HTML...');
  
  // Read files
  const publicationsMarkdown = fs.readFileSync('content/publications.md', 'utf8');
  const awardsMarkdown = fs.readFileSync('content/awards.md', 'utf8');
  const template = fs.readFileSync('content/templates/publications.html', 'utf8');
  
  // Convert to HTML
  const publicationsHTML = convertPublications(publicationsMarkdown);
  const awardsHTML = convertAwards(awardsMarkdown);
  
  // Replace placeholders
  const finalHTML = template
    .replace('{{PUBLICATIONS_CONTENT}}', publicationsHTML)
    .replace('{{AWARDS_CONTENT}}', awardsHTML);
  
  // Write output
  fs.writeFileSync('publications.html', finalHTML);
  
  console.log('Generated publications.html successfully!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
#!/usr/bin/env python3

import re
from pathlib import Path

def convert_publications(markdown_content):
    """Convert publications markdown to HTML with custom structure."""
    # Remove the header first
    content = markdown_content.replace('# Publications\n\n', '')
    sections = [s.strip() for s in content.split('---') if s.strip()]
    result = []
    
    for section in sections:
            
        lines = [line.strip() for line in section.split('\n') if line.strip()]
        if len(lines) < 3:
            continue
            
        title = lines[0].replace('## ', '')
        authors = lines[1].replace('**Authors:** ', '')
        # Convert **text** to <strong>text</strong>
        authors = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', authors)
        
        venue = lines[2].replace('**Venue:** ', '')
        links = lines[3].replace('**Links:** ', '') if len(lines) > 3 else ''
        # Convert doi:xxx to clickable link first (before markdown links)
        links = re.sub(r'doi:([\d\./\w-]+)', r'<a href="https://doi.org/\1">doi:\1</a>', links)
        # Convert hal-xxxxx to clickable link (before markdown links)
        links = re.sub(r'\bhal-(\d+)\b', r'<a href="https://hal.science/hal-\1/">hal-\1</a>', links)
        # Convert [text](url) to <a href="url">[text]</a>
        links = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">[\1]</a>', links)
        # Replace | with spaces for better formatting
        links = links.replace(' | ', '\n        ')
        
        html = f'''<div class="publication">
    <p><strong>{title}</strong></p>
    <p>{authors}</p>
    <p>{venue}</p>
    <p>
        {links}
    </p>
</div>'''
        result.append(html)
    
    return '\n'.join(result)

def convert_awards(markdown_content):
    """Convert awards markdown to HTML with custom structure."""
    # Remove the header first
    content = markdown_content.replace('# Grants and Awards\n\n', '')
    sections = [s.strip() for s in content.split('---') if s.strip()]
    result = ['<h1>Grants and Awards</h1>']
    
    for section in sections:
            
        lines = [line.strip() for line in section.split('\n') if line.strip()]
        if len(lines) < 2:
            continue
            
        title = lines[0].replace('## ', '')
        description = ' '.join(lines[1:])
        
        html = f'''    <div class="award-item">
        <p><strong>{title}</strong></p>
        <p>{description}</p>
    </div>'''
        result.append(html)
    
    return '\n'.join(result)

def main():
    """Main build function."""
    print("Converting markdown to HTML...")
    
    try:
        # Read input files
        publications_md = Path('content/publications.md').read_text()
        awards_md = Path('content/awards.md').read_text()
        template = Path('content/templates/publications.html').read_text()
        
        # Convert to HTML
        publications_html = convert_publications(publications_md)
        awards_html = convert_awards(awards_md)
        
        # Replace placeholders in template
        final_html = template.replace('{{PUBLICATIONS_CONTENT}}', publications_html)
        final_html = final_html.replace('{{AWARDS_CONTENT}}', awards_html)
        
        # Write output
        Path('publications.html').write_text(final_html)
        
        print("Generated publications.html successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
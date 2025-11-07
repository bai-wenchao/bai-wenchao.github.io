# Content Management Guide

This website now uses a modular configuration-driven approach where content is organized across multiple configuration files. This makes it easy to update content without modifying the HTML structure and provides better organization.

## How It Works

1. **Main Configuration**: `config/site.json` references all content configs
2. **Modular Configs**: Separate JSON files for different content sections
3. **Content Loader**: `assets/js/content-loader.js` dynamically loads and merges all configs
4. **Template Variables**: Jekyll variables are processed and replaced with actual values

## File Structure

```
├── index.html                 # Main page (minimal, just loading content)
├── config/
│   ├── site.json             # Main configuration (references other configs)
│   ├── profile.json          # Personal info, hero, about, contact, CV
│   ├── research.json         # Research interests and publications
│   └── content.json          # News, posts, and dynamic content
├── assets/js/
│   ├── content-loader.js     # Dynamic content loading logic
│   └── main.js              # Existing functionality
└── _layouts/default.html    # Page layout (includes content loader)
```

## Configuration Files Overview

### `config/site.json` - Main Configuration
This is the entry point that defines:
- Site metadata and version
- List of all content configuration files to load
- Site data (author info, social links)

### `config/profile.json` - Personal Information
Contains:
- **Hero Section**: Personal title, affiliation, profile image
- **About Section**: Personal background and introduction
- **Contact Section**: Contact information and office details
- **CV Section**: Curriculum vitae information

### `config/research.json` - Academic Content
Contains:
- **Research Interests**: Areas of research with descriptions
- **Publications**: Academic papers with full details (authors, abstracts, links, BibTeX)

### `config/content.json` - Dynamic Content
Contains:
- **News**: Recent news items with dates and descriptions
- **Posts**: Blog posts, presentations, and other articles

## How to Update Content

### Quick Reference
- **Personal Info**: Edit `config/profile.json`
- **Research & Publications**: Edit `config/research.json`
- **News & Posts**: Edit `config/content.json`
- **Site-wide Settings**: Edit `config/site.json`

### Adding News Items
Add to the `news.items` array in `config/content.json`:
```json
{
  "date": "2025-11-01",
  "date_display": "Nov. 1, 2025",
  "title": "New Achievement",
  "content": "Description of the achievement..."
}
```

### Adding Publications
Add to the `publications.items` array in `config/research.json` with all required fields.

### Adding Research Areas
Add to the `research.areas` array in `config/research.json`:
```json
{
  "title": "New Research Area",
  "description": "Description of the research area..."
}
```

### Adding New Configuration Files
1. Create your new config file in the `config/` directory
2. Add it to the `configs` array in `config/site.json`
3. The content loader will automatically load and merge it

## Configuration File Structure

Each configuration file follows the same structure as before but is now separated by content type:

### Hero Section
```json
"hero": {
  "title": "Your Name (Chinese Name)",
  "subtitle": "Your Title",
  "affiliation": "Your Institution",
  "description": "Brief description",
  "profile_image": "/path/to/image.jpg"
}
```

### About Section
```json
"about": {
  "title": "About Me",
  "sections": [
    {"text": "Paragraph content..."},
    {"text": "Another paragraph..."}
  ]
}
```

### News Section
```json
"news": {
  "title": "Recent News",
  "items": [
    {
      "date": "2025-10-16",
      "date_display": "Oct. 16, 2025",
      "title": "News Title",
      "content": "News content..."
    }
  ]
}
```

### Research Interests
```json
"research": {
  "title": "Research Interests",
  "areas": [
    {
      "title": "Research Area",
      "description": "Description of the area..."
    }
  ]
}
```

### Publications
```json
"publications": {
  "title": "Selected Publications",
  "show_all_link": "https://scholar.google.com/...",
  "items": [
    {
      "authors": "Author list",
      "title": "Paper Title",
      "venue": "Conference/Journal, Year",
      "abstract": "Paper abstract...",
      "category": "Category",
      "tags": ["Tag1", "Tag2"],
      "links": [
        {"text": "Paper", "url": "/path/to/paper.pdf"}
      ],
      "bibtex": "BibTeX citation..."
    }
  ]
}
```

### Posts
Similar structure to publications but for blog posts/preprints.

### CV Section
```json
"cv": {
  "title": "Curriculum Vitae",
  "description": "Description text...",
  "cv_link": "/path/to/cv.pdf"
}
```

### Contact Section
```json
"contact": {
  "title": "Contact",
  "email": "your.email@example.com",
  "office": {
    "room": "Room Number",
    "affiliation": "Institution",
    "campus": "Campus",
    "postal_code": "Code",
    "address": "Address"
  },
  "intro": "Contact introduction text..."
}
```

## Template Variables

The configuration supports Jekyll template variables using `{{ site.variable.path }}` syntax. These are automatically replaced with values from `_config.yml`:

- `{{ site.author.name }}` - Author name
- `{{ site.author.name_cn }}` - Chinese name
- `{{ site.author.title }}` - Title/position
- `{{ site.author.email }}` - Email
- `{{ site.author.affiliation }}` - Institution
- `{{ site.author.department }}` - Department
- `{{ site.author.campus }}` - Campus
- `{{ site.author.room }}` - Office room
- `{{ site.author.address }}` - Address
- `{{ site.author.postal_code }}` - Postal code
- `{{ site.social.google_scholar }}` - Google Scholar link

## How to Update Content

1. **Open `content-config.json`**
2. **Locate the section you want to modify**
3. **Update the content as needed**
4. **Save the file**

The changes will be reflected immediately when you reload the page.

## Adding New Content

### Adding News Items
Add to the `news.items` array:
```json
{
  "date": "2025-11-01",
  "date_display": "Nov. 1, 2025",
  "title": "New Achievement",
  "content": "Description of the achievement..."
}
```

### Adding Publications
Add to the `publications.items` array with all required fields.

### Adding Research Areas
Add to the `research.areas` array:
```json
{
  "title": "New Research Area",
  "description": "Description of the research area..."
}
```

## Benefits of This Modular Approach

1. **Better Organization**: Related content is grouped together logically
2. **Easier Maintenance**: Update specific content types without touching other files
3. **Version Control Friendly**: Content changes are easy to track and review
4. **Modular Loading**: Content loads in parallel for better performance
5. **Scalability**: Easy to add new content sections by creating new config files
6. **Separation of Concerns**: Layout (HTML) is separate from content (JSON)
7. **Template Support**: Still works with Jekyll variables
8. **Error Resilience**: If one config fails to load, others still work

## Technical Notes

- Content is loaded in parallel for better performance
- All configs are merged before template variable processing
- Template variables are processed client-side
- All existing functionality (news toggle, abstract folding, etc.) is preserved
- Loading indicator shows while content is being fetched
- Error handling included if any config files fail to load
- Graceful degradation if some configs fail

## Troubleshooting

**Content not loading?**
- Check browser console for specific error messages
- Ensure all config files in `config/` directory are accessible
- Verify JSON syntax is correct in all config files
- Check that `config/site.json` lists all required config files

**Template variables not working?**
- Ensure variables exist in `config/site.json` under `site_data`
- Check variable names match exactly in template strings
- Template variables are case-sensitive

**Some content missing?**
- Check if individual config files failed to load (console errors)
- Verify the file is listed in `config/site.json` configs array
- Ensure JSON syntax is valid in the specific config file

**Performance issues?**
- Config files load in parallel, so large configs don't block others
- Consider splitting very large sections into separate files
- Browser caching helps on subsequent visits

**Adding new content sections?**
1. Create new config file in `config/` directory
2. Add to `configs` array in `config/site.json`
3. Update content loader methods if adding new section types
4. Add corresponding render methods in `content-loader.js`
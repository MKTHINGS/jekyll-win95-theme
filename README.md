# Windows 95 Jekyll Theme

A Jekyll theme inspired by the classic Windows 95 UI Kit, featuring multilingual support for Italian, English, French, Spanish, German, and Romanian.

## Overview

This theme replicates the iconic Windows 95 user interface, bringing nostalgic 90's design to your Jekyll site. It's built based on the [Windows 95 UI Kit by Themesberg](https://themesberg.com/product/ui-kit/windows-95-ui-kit) and includes multilingual support for six languages.

## Features

- Complete Windows 95 aesthetic with authentic UI components
- Multilingual support for Italian, English, French, Spanish, German, and Romanian
- Responsive design that maintains the Windows 95 look and feel
- Built on Jekyll for easy content management
- Includes common UI components like buttons, windows, dialogs, and more

## Installation

### Option 1: As a Remote Theme

Add this line to your Jekyll site's `_config.yml`:

```yaml
remote_theme: yourusername/windows95-jekyll-theme
```

And then execute:

```bash
$ bundle
```

### Option 2: Manual Installation

1. Download or clone this repository
2. Copy the theme files to your Jekyll site
3. Add the necessary configuration to your `_config.yml`

## Usage

### Basic Configuration

Configure the theme in your `_config.yml`:

```yaml
title: Your Site Title
description: Your site description
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com

# Language settings
default_lang: "en"
```

### Creating Content in Multiple Languages

Content should be organized in language-specific directories:

- Posts: `_posts/en/`, `_posts/it/`, etc.
- Pages: `pages/en/`, `pages/it/`, etc.

Each content file should include language in the front matter:

```yaml
---
layout: post
title: My Post Title
lang: en
---
```

### Language Selector

The theme includes a language selector component that can be included in your layouts:

```liquid
{% include language-selector.html %}
```

## Directory Structure

```
windows95-jekyll-theme/
├── _data/                      # Data files for multilingual content
│   └── i18n/                   # Internationalization data
│       ├── en.yml              # English translations
│       ├── it.yml              # Italian translations
│       ├── fr.yml              # French translations
│       ├── es.yml              # Spanish translations
│       ├── de.yml              # German translations
│       └── ro.yml              # Romanian translations
├── _includes/                  # Reusable components
│   ├── head.html               # Document head with meta tags
│   ├── header.html             # Site header with navigation
│   ├── footer.html             # Site footer
│   └── language-selector.html  # Language switching component
├── _layouts/                   # Template layouts
│   ├── default.html            # Base layout
│   ├── post.html               # Blog post layout
│   └── page.html               # Regular page layout
├── _posts/                     # Sample blog posts
│   ├── en/                     # English posts
│   ├── it/                     # Italian posts
│   ├── fr/                     # French posts
│   ├── es/                     # Spanish posts
│   ├── de/                     # German posts
│   └── ro/                     # Romanian posts
├── assets/                     # Theme assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   └── images/                 # Theme images
├── pages/                      # Static pages in different languages
├── _config.yml                 # Jekyll configuration
└── README.md                   # Theme documentation
```

## Windows 95 UI Components

The theme includes the following Windows 95-style UI components:

- **Buttons**: Classic 3D-style buttons with hover and active states
- **Windows/Cards**: Window-like containers with title bars
- **Dialog Boxes**: Modal windows for alerts and confirmations
- **Form Elements**: Inputs, checkboxes, radio buttons with Windows 95 styling
- **Tabs**: Classic Windows 95 tabbed interfaces
- **Menus**: Dropdown menus with Windows 95 styling
- **Progress Bars**: Windows 95-style progress indicators
- **Icons**: Classic Windows 95 icons

## Customization

### Colors

You can customize the Windows 95 color scheme in your `_config.yml`:

```yaml
colors:
  window_bg: "#c0c0c0"
  window_title_active: "#000080"
  window_title_inactive: "#808080"
  button_face: "#c0c0c0"
  button_shadow: "#808080"
  button_highlight: "#ffffff"
  text: "#000000"
  highlight_bg: "#000080"
  highlight_text: "#ffffff"
```

### Typography

The theme uses fonts that mimic the Windows 95 system fonts. You can customize these in the CSS files.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/yourusername/windows95-jekyll-theme.

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
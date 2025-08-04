import yaml
from jinja2 import Template

# Load YAML content from 'portfolio_data.yml'
with open('portfolio_data.yml', 'r') as file:
    data = yaml.safe_load(file)

# Basic HTML template using Jinja2
html_template = Template('''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ meta["title"] }}</title>
  <style>
    body { font-family: sans-serif; margin: 0; color: #333; }
    header { background: #0062b9; color: white; padding: 4rem 1rem; text-align: center; }
    nav a { color: white; margin: 0 0.5rem; text-decoration: none; }
    section { padding: 4rem 1rem; max-width: 800px; margin: 0 auto; }
    h2 { font-size: 2rem; margin-top: 0; }
    ul { padding-left: 1.2rem; }
    footer { text-align: center; padding: 2rem 1rem; color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <h1>{{ meta["title"] }}</h1>
    <p>{{ meta["subtitle"] }}</p>
    <nav>
      {% for section in sections %}<a href="#{{ section["id"] }}">{{ section["title"] }}</a>{% if not loop.last %} · {% endif %}{% endfor %}
    </nav>
  </header>

  {% for section in sections %}
  <section id="{{ section["id"] }}">
    <h2>{{ section["title"] }}</h2>
    {% if section.get("content") %}
      <p>{{ section["content"] }}</p>
    {% elif section.get("items") %}
      <ul>{% for item in section["items"] %}<li>{{ item }}</li>{% endfor %}</ul>
    {% elif section.get("jobs") %}
      {% for job in section["jobs"] %}
        <h3>{{ job["role"] }} @ {{ job["company"] }} ({{ job["period"] }})</h3>
        <ul>{% for h in job["highlights"] %}<li>{{ h }}</li>{% endfor %}</ul>
      {% endfor %}
    {% elif section.get("services") %}
      <p>{{ section["description"] }}</p>
      <ul>{% for service in section["services"] %}<li>{{ service }}</li>{% endfor %}</ul>
    {% endif %}
  </section>
  {% endfor %}

  <footer>&copy; 2025 {{ meta["title"] }}</footer>
</body>
</html>
''')

# Render the HTML
output_html = html_template.render(meta=data['meta'], sections=data['sections'])

# Write to index.html
with open('index.html', 'w') as f:
    f.write(output_html)

print("Portfolio HTML generated successfully!")

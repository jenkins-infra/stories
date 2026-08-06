# User Story  Submission Guidelines

Thank you for contributing a success story! These stories showcase how organizations and individuals use Jenkins in the real world. To keep the collection consistent and maintainable, please follow the guidelines below.

## Before You Start

Before creating a new story, browse a few existing stories to understand the expected structure and writing style. [reference story](https://stories.jenkins.io/user-story/jenkins-backbone-of-continuous-integration/)

Also, check the YAML file to understand the structure. [reference YAML file](https://github.com/jenkins-infra/stories/blob/main/src/user-story/jenkins-backbone-of-continuous-integration/index.yaml)

## Required Fields

Every story must include the following top-level fields:

- Story Title
- Organization
- Author Name
- Organization Location
- Tag Line
- Your Story
- Story Image
- Quote Author
- Quote
- Quote Image
- Consent (checkbox)

## Metadata

The metadata section provides additional information about the story.

The following fields are currently supported:

- Company Website
- Project Website
- Project Funding
- Funded By
- Summary
- Industries
- Programming Languages
- Platforms
- Version Control Systems
- Build Tools
- Jenkins Plugins
- Community Support
- Team Members

> **Note:** The schema does not allow unsupported or unknown fields. Adding additional metadata fields will cause validation to fail.

## Writing Guidelines
- Use clear, concise, and professional language.
- Focus on how Jenkins was used and the value it provided.
- Use complete sentences and proper grammar.
- Keep headings short and meaningful.

### body_content
The main content of the story belongs in the `body_content` section.

Example:
```yaml
body_content:
  title: Our Jenkins Journey
  paragraphs:
    - First paragraph describing your experience.
    - Second paragraph explaining the impact Jenkins had.
    - Third paragraph summarizing key takeaways.
```
Each paragraph should be a separate item in the paragraphs array.

### URLs
- Use plain URLs without Markdown link syntax.
- Include the protocol (https://) where applicable.
- Verify that all links are valid before submitting.

**Good**
```
company_website: https://example.com
```
**Avoid**
```
company_website: "[Example](https://example.com)"
company_website: <https://example.com>
```

## Image Upload Guidelines

Drag and drop an image into the text area, or copy and paste it from your clipboard.

Images help showcase your Jenkins success story and improve its presentation.

### Supported Formats

Upload images in one of the following formats:

- PNG (`.png`) **(recommended)**
- JPEG (`.jpeg`)
- JPG (`.jpg`)
- WebP (`.webp`)

### Image Dimensions

- Use **square images (1:1 aspect ratio)** whenever possible.
- Recommended size: **1024 × 1024 pixels** or larger.
- Images should be clear, high-quality, and not pixelated.

### Images in `body_content`

Images can be embedded directly within the story using standard Markdown image syntax.

**Syntax**

```md
![Image description](https://example.com/image.png)
```

**Example**

```md
paragraphs:
  - Jenkins powers our CI/CD pipeline across multiple teams.

  - ![Our Jenkins dashboard](https://example.com/jenkins-dashboard.png)

  - The dashboard provides real-time visibility into build status and deployment health.
```

> **Note:** Use publicly accessible image URLs or upload images through the GitHub Issue Form. Uploaded images will be automatically included in the generated story.

**There are no fixed dimension or aspect ratio requirements for images in `body_content`.**

## Quotes
The `quotes` section is used to highlight testimonials or insights from contributors.

Each quote supports:

- `from` – The name of the person being quoted. You may include their role and organization for context.
- `content` – The quote text.
- `image` – The path to the person's image. (strictly named as quote.png)

**Example**

```yaml
quotes:
  - from: Jane Doe, Software Engineer, abc Organization
    content: Jenkins has streamlined our CI/CD pipeline and significantly improved our development workflow.
    image: ./quote.png
```
## Before Opening a Pull Request

- Review your story for spelling and grammar.
- Verify all links work.
- Confirm images render correctly.
- Run all validation checks.
- Ensure your commit contains only the intended changes.

class ContentLoader {
  constructor() {
    this.config = {};
    this.isLoaded = false;
  }

  async loadConfig() {
    try {
      // Load configs with cache-busting for better performance
      const cacheBuster = Date.now();

      // Load the site configuration to get the list of configs
      const siteResponse = await fetch(`/config/site.json?v=${cacheBuster}`, {
        cache: 'no-cache'
      });
      const siteConfig = await siteResponse.json();

      // Prioritize critical configs for faster initial render
      const criticalConfigs = ['config/profile.json'];
      const secondaryConfigs = siteConfig.configs.filter(config =>
        !criticalConfigs.includes(config)
      );

      // Load critical configs first
      const criticalPromises = criticalConfigs.map(async (configPath) => {
        try {
          const response = await fetch(`/${configPath}?v=${cacheBuster}`, {
            cache: 'no-cache'
          });
          const configData = await response.json();
          return configData;
        } catch (error) {
          console.error(`Error loading critical config ${configPath}:`, error);
          return {};
        }
      });

      // Load secondary configs with lower priority
      const secondaryPromises = secondaryConfigs.map(async (configPath) => {
        try {
          const response = await fetch(`/${configPath}?v=${cacheBuster}`, {
            cache: 'no-cache'
          });
          const configData = await response.json();
          return configData;
        } catch (error) {
          console.error(`Error loading config ${configPath}:`, error);
          return {};
        }
      });

      // Wait for critical configs first
      const criticalConfigsData = await Promise.all(criticalPromises);

      // Start secondary config loading
      const secondaryConfigsData = await Promise.all(secondaryPromises);

      // Merge critical configs immediately
      this.config = criticalConfigsData.reduce((merged, config) => {
        return { ...merged, ...config };
      }, {});

      // Merge secondary configs now (synchronous)
      secondaryConfigsData.forEach(config => {
        if (config.title === "Recent News" && config.items) {
          this.config.news = config;
        } else if (config.title === "Latest Posts" && config.items) {
          this.config.posts = config;
        } else if (config.title === "Awesome Resources" && config.categories) {
          this.config.awesome = config;
        } else {
          this.config = { ...this.config, ...config };
        }
      });

      this.isLoaded = true;

    } catch (error) {
      console.error('Error loading site configuration:', error);
      this.isLoaded = false;
    }
  }

  renderHero() {
    const hero = this.config?.hero;
    if (!hero) return '';

    return `
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>${hero.title}</h1>
              <p class="hero-subtitle">${hero.subtitle}</p>
              <p class="hero-affiliation">${hero.affiliation}</p>
              <p class="hero-description">${hero.description}</p>
            </div>
            <div class="hero-image">
              <img src="${hero.profile_image}" alt="${hero.title}" class="profile-photo">
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderAbout() {
    const about = this.config?.about;
    if (!about) return '';

    const sections = about.sections.map(section => `<p>${section.text}</p>`).join('');

    return `
      <section id="about" class="section">
        <div class="container">
          <h2 class="section-title">${about.title}</h2>
          <div class="about-content">
            <div class="about-text">
              ${sections}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderNews() {
    const news = this.config?.news;
    if (!news) return '';

    const newsItems = news.items.map(item => `
      <div class="news-item" data-date="${item.date}">
        <div class="news-date">
          <i class="fas fa-calendar"></i>
          ${item.date_display}
        </div>
        <div class="news-content">
          <h3>${item.title}</h3>
          <p>${item.content}</p>
        </div>
      </div>
    `).join('');

    return `
      <section id="news" class="section section-alt">
        <div class="container">
          <h2 class="section-title">${news.title}</h2>
          <div class="news-list" id="news-list">
            ${newsItems}
          </div>
          <div class="news-toggle" id="news-toggle-container" style="display: none;">
            <button class="btn btn-secondary" id="news-toggle-btn">
              <span id="news-toggle-text">Show More News</span>
              <i class="fas fa-chevron-down" id="news-toggle-icon"></i>
            </button>
          </div>
        </div>
      </section>
    `;
  }

  renderResearch() {
    const research = this.config?.research;
    if (!research) return '';

    const researchItems = research.areas.map(area => `
      <div class="research-item">
        <h3>${area.title}</h3>
        <p>${area.description}</p>
      </div>
    `).join('');

    return `
      <section id="research" class="section section-alt">
        <div class="container">
          <h2 class="section-title">${research.title}</h2>
          <div class="research-grid">
            ${researchItems}
          </div>
        </div>
      </section>
    `;
  }

  renderPublications() {
    const publications = this.config?.publications;
    if (!publications) return '';

    const pubItems = publications.items.map((pub) => `
      <div class="publication-item">
        <div class="publication-content">
          <p class="publication-authors">
            ${pub.authors}
          </p>
          <h3>${pub.title}</h3>
          <p class="publication-venue">
            ${pub.venue}
          </p>
          <p class="publication-abstract">
            ${pub.abstract}
          </p>
          <div class="post-tags">
            <span class="tag category-tag">${pub.category}</span>
            ${pub.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="publication-links">
            ${pub.links.map(link => `<a href="${link.url}" class="btn btn-small">${link.text}</a>`).join('')}
            <button class="btn btn-small" onclick="copyToClipboard(\`${pub.bibtex.replace(/`/g, '\\`')}\`)">BibTeX</button>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <section id="publications" class="section">
        <div class="container">
          <h2 class="section-title">${publications.title}</h2>
          <div class="publications-list">
            ${pubItems}
          </div>
          <div class="text-center">
            <a href="${publications.show_all_link}" class="btn">View All Publications</a>
          </div>
        </div>
      </section>
    `;
  }

  renderPosts() {
    const posts = this.config?.posts;
    if (!posts) return '';

    const postItems = posts.items.map(post => `
      <div class="publication-item">
        <div class="publication-content">
          <p class="publication-authors">
            ${post.authors}
          </p>
          <h3>${post.title}</h3>
          <p class="publication-venue">
            ${post.date}
          </p>
          <p class="publication-abstract">
            ${post.abstract}
          </p>
          <div class="post-tags">
            <span class="tag category-tag">${post.category}</span>
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="publication-links">
            ${post.links.map(link => `<a href="${link.url}" class="btn btn-small">${link.text}</a>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    return `
      <section id="posts" class="section section-alt">
        <div class="container">
          <h2 class="section-title">${posts.title}</h2>
          <div class="publications-list">
            ${postItems}
          </div>
        </div>
      </section>
    `;
  }

  renderCV() {
    const cv = this.config?.cv;
    if (!cv) return '';

    return `
      <section id="cv" class="section">
        <div class="container">
          <h2 class="section-title">${cv.title}</h2>
          <div class="cv-content">
            <p>${cv.description}</p>
            <div class="cv-links">
              <a href="${cv.cv_link}" class="btn" target="_blank">
                <i class="fas fa-download"></i> Download CV (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderAwesome() {
    const awesome = this.config?.awesome;
    if (!awesome) return '';

    const categories = awesome.categories.map(category => {
      if (category.subsections) {
        // Handle categories with subsections (like "HowTo")
        return `
          <div class="awesome-category">
            <h3>${category.title}</h3>
            <p class="category-description">${category.description}</p>
            <div class="awesome-subsections">
              ${category.subsections.map(subsection => `
                <div class="awesome-subsection">
                  <h4>${subsection.title}</h4>
                  <div class="awesome-grid">
                    ${subsection.items.map(item => `
                      <div class="awesome-item">
                        <div class="awesome-icon">
                          <i class="${item.icon}"></i>
                        </div>
                        <div class="awesome-content">
                          <h5><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a></h5>
                          <p>${item.description}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        // Handle regular categories with direct items (like "Misc")
        return `
          <div class="awesome-category">
            <h3>${category.title}</h3>
            <p class="category-description">${category.description}</p>
            <div class="awesome-grid">
              ${category.items.map(item => `
                <div class="awesome-item">
                  <div class="awesome-icon">
                    <i class="${item.icon}"></i>
                  </div>
                  <div class="awesome-content">
                    <h4><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a></h4>
                    <p>${item.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }).join('');

    return `
      <section id="awesome" class="section section-alt">
        <div class="container">
          <h2 class="section-title">${awesome.title}</h2>
          <p class="section-description">${awesome.description}</p>
          <div class="awesome-categories">
            ${categories}
          </div>
        </div>
      </section>
    `;
  }

  renderContact() {
    const contact = this.config?.contact;
    if (!contact) return '';

    return `
      <section id="contact" class="section">
        <div class="container">
          <h2 class="section-title">${contact.title}</h2>
          <div class="contact-content">
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p><a href="mailto:${contact.email}">${contact.email}</a></p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Office</h3>
                  <p>${contact.office.room}<br>${contact.office.affiliation}, ${contact.office.campus}<br>${contact.office.postal_code}, ${contact.office.address}</p>
                </div>
              </div>
            </div>
            <div class="contact-form">
              <h3>Get in Touch</h3>
              <p>${contact.intro}</p>
              <div class="contact-buttons">
                <a href="mailto:${contact.email}" class="btn">Send Me an Email</a>
                <a href="{{ "/feed.xml" | absolute_url }}" class="btn btn-outline" target="_blank">
                  <i class="fas fa-rss"></i> RSS Feed
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="clustrmaps-container" id="clustrmaps-container">
          <!-- ClustrMaps will be loaded asynchronously -->
        </div>
      </section>
    `;
  }

  async renderAll() {
    // Show immediate loading indicator
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: #666;">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 20px;"></i>
          <p>Loading content...</p>
        </div>
      `;
    }

    // Start loading configs immediately but with a timeout
    const loadPromise = this.loadConfig();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Loading timeout')), 5000)
    );

    try {
      await Promise.race([loadPromise, timeoutPromise]);

      if (!this.isLoaded || Object.keys(this.config).length === 0) {
        console.error('Failed to load content configuration');
        return this.renderErrorState();
      }

      // Render content progressively
      return this.renderProgressiveContent();

    } catch (error) {
      console.error('Content loading error:', error);
      return this.renderErrorState();
    }
  }

  renderErrorState() {
    return `
      <div style="text-align: center; padding: 100px 20px; color: #666;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; color: #ff9800;"></i>
        <h3>Unable to Load Content</h3>
        <p>Please check your internet connection and try refreshing the page.</p>
      </div>
    `;
  }

  renderProgressiveContent() {
    // Render critical sections first
    const criticalContent = `
      ${this.renderHero()}
      ${this.renderAbout()}
    `;

    // Render less critical sections after a delay to allow async config loading
    setTimeout(async () => {
      await this.renderSecondaryContent();
    }, 500); // Increased delay to ensure secondary configs are loaded

    return criticalContent;
  }

  async renderSecondaryContent() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Wait a bit for secondary configs to be loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    const secondaryContent = `
      ${this.renderNews()}
      ${this.renderResearch()}
      ${this.renderPublications()}
      ${this.renderPosts()}
      ${this.renderAwesome()}
      ${this.renderCV()}
      ${this.renderContact()}
    `;

    // Append secondary content to existing content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = secondaryContent;

    while (tempDiv.firstChild) {
      mainContent.appendChild(tempDiv.firstChild);
    }

    // Re-initialize any JavaScript functionality
    if (typeof initializeNewsSection === 'function') {
      initializeNewsSection();
    }
    if (typeof initializeAbstractFolding === 'function') {
      initializeAbstractFolding();
    }

    // Load ClustrMaps asynchronously after all content is rendered
    this.loadClustrMaps();
  }

  loadClustrMaps() {
    // Load ClustrMaps after a delay to avoid blocking the main thread
    setTimeout(() => {
      const clustrmapsContainer = document.getElementById('clustrmaps-container');
      if (clustrmapsContainer) {
        // Set container size to make the map smaller
        clustrmapsContainer.style.maxWidth = '250px';
        clustrmapsContainer.style.margin = '0 auto';

        const script = document.createElement('script');
        script.id = 'clustrmaps';
        script.src = '//clustrmaps.com/map_v2.js?d=Kpl7cD5NrwlEv9oVnKbHEYyn6TJ3gYDgS1-uoXs9qzM&cl=ffffff&w=250';
        script.async = true;
        clustrmapsContainer.appendChild(script);
      }
    }, 2000); // Load after 2 seconds
  }
}

// Global function to render content
async function renderContent() {
  const loader = new ContentLoader();
  const content = await loader.renderAll();

  // Find the main content area and replace its content
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.innerHTML = content;

    // Re-initialize any JavaScript functionality that depends on the content
    if (typeof initializeNewsSection === 'function') {
      initializeNewsSection();
    }
    if (typeof initializeAbstractFolding === 'function') {
      initializeAbstractFolding();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', renderContent);
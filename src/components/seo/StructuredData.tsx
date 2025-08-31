'use client';

import { useEffect } from 'react';

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  category?: string;
  tags?: string[];
}

interface WebsiteStructuredDataProps {
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
}

export function BlogPostStructuredData({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  category,
  tags
}: BlogPostStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": author.name,
        ...(author.url && { "url": author.url })
      },
      "datePublished": datePublished,
      ...(dateModified && { "dateModified": dateModified }),
      ...(image && { 
        "image": {
          "@type": "ImageObject",
          "url": image
        }
      }),
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "publisher": {
        "@type": "Organization",
        "name": "Vibe Blog",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vibe-blog.vercel.app'}/logo.png`
        }
      },
      ...(category && { "articleSection": category }),
      ...(tags && tags.length > 0 && { "keywords": tags.join(", ") })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'blog-post-structured-data';

    // 移除已存在的结构化数据
    const existing = document.getElementById('blog-post-structured-data');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('blog-post-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, author, datePublished, dateModified, image, url, category, tags]);

  return null;
}

export function WebsiteStructuredData({
  name,
  description,
  url,
  logo,
  sameAs
}: WebsiteStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": name,
      "description": description,
      "url": url,
      ...(logo && { 
        "logo": {
          "@type": "ImageObject",
          "url": logo
        }
      }),
      ...(sameAs && sameAs.length > 0 && { "sameAs": sameAs }),
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${url}/blog?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'website-structured-data';

    // 移除已存在的结构化数据
    const existing = document.getElementById('website-structured-data');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('website-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, description, url, logo, sameAs]);

  return null;
}

export function PersonStructuredData({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs
}: PersonStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": jobTitle,
      "description": description,
      "url": url,
      ...(image && { 
        "image": {
          "@type": "ImageObject",
          "url": image
        }
      }),
      ...(sameAs && sameAs.length > 0 && { "sameAs": sameAs })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'person-structured-data';

    // 移除已存在的结构化数据
    const existing = document.getElementById('person-structured-data');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('person-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, jobTitle, description, url, image, sameAs]);

  return null;
}

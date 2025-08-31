<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/> - RSS订阅</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .header h1 {
            color: white;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          
          .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            margin-bottom: 20px;
          }
          
          .rss-info {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .rss-info h2 {
            color: white;
            font-size: 1.3rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .rss-info p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 15px;
          }
          
          .rss-url {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 12px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            color: #fff;
            word-break: break-all;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .posts {
            margin-top: 30px;
          }
          
          .posts h2 {
            color: white;
            font-size: 1.5rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .post-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }
          
          .post-item:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .post-title {
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
            text-decoration: none;
            display: block;
          }
          
          .post-title:hover {
            color: #ffd700;
          }
          
          .post-meta {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 10px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          
          .post-description {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
          }
          
          .icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.7);
          }
          
          @media (max-width: 768px) {
            .container {
              padding: 20px;
              margin: 10px;
            }
            
            .header h1 {
              font-size: 2rem;
              flex-direction: column;
              gap: 10px;
            }
            
            .post-meta {
              flex-direction: column;
              gap: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              <svg class="icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;">
                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248S0 22.546 0 20.752s1.456-3.248 3.252-3.248 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
              </svg>
              <xsl:value-of select="rss/channel/title"/>
            </h1>
            <p><xsl:value-of select="rss/channel/description"/></p>
          </div>
          
          <div class="rss-info">
            <h2>
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              RSS订阅说明
            </h2>
            <p>这是一个RSS订阅源，您可以使用RSS阅读器订阅本站的最新文章。将下面的URL添加到您的RSS阅读器中：</p>
            <div class="rss-url">
              <xsl:value-of select="rss/channel/atom:link/@href"/>
            </div>
          </div>
          
          <div class="posts">
            <h2>
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              最新文章 (<xsl:value-of select="count(rss/channel/item)"/> 篇)
            </h2>
            
            <xsl:for-each select="rss/channel/item">
              <div class="post-item">
                <a class="post-title" href="{link}">
                  <xsl:value-of select="title"/>
                </a>
                <div class="post-meta">
                  <span>
                    <svg class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <xsl:value-of select="author"/>
                  </span>
                  <span>
                    <svg class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24">
                      <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7v2H3V4h3.5l1-1h5l1 1H17z"/>
                    </svg>
                    <xsl:value-of select="category"/>
                  </span>
                  <span>
                    <svg class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <xsl:value-of select="substring(pubDate, 1, 16)"/>
                  </span>
                </div>
                <div class="post-description">
                  <xsl:value-of select="description"/>
                </div>
              </div>
            </xsl:for-each>
          </div>
          
          <div class="footer">
            <p>最后更新：<xsl:value-of select="substring(rss/channel/lastBuildDate, 1, 16)"/></p>
            <p>由 <strong>Vibe Blog</strong> 强力驱动</p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

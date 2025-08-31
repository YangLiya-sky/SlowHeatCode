<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/> - RSS订阅</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .rss-info {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .rss-info h2 {
            color: #667eea;
            margin-top: 0;
          }
          .rss-url {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            border-left: 4px solid #667eea;
          }
          .item {
            background: white;
            margin-bottom: 20px;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
          }
          .item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }
          .item h3 {
            margin: 0 0 10px 0;
            color: #333;
          }
          .item h3 a {
            color: #667eea;
            text-decoration: none;
            font-size: 1.3em;
          }
          .item h3 a:hover {
            text-decoration: underline;
          }
          .item-meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 15px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          .item-meta span {
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .item-description {
            color: #555;
            line-height: 1.7;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
          }
          @media (max-width: 600px) {
            body {
              padding: 10px;
            }
            .header h1 {
              font-size: 2em;
            }
            .item-meta {
              flex-direction: column;
              gap: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="rss/channel/title"/></h1>
          <p><xsl:value-of select="rss/channel/description"/></p>
        </div>
        
        <div class="rss-info">
          <h2>📡 RSS订阅信息</h2>
          <p>这是一个RSS订阅源，您可以将以下链接添加到您的RSS阅读器中：</p>
          <div class="rss-url">
            <xsl:value-of select="rss/channel/link"/>/api/rss
          </div>
          <p style="margin-top: 15px; color: #666; font-size: 0.9em;">
            推荐RSS阅读器：Feedly、Inoreader、NewsBlur 等
          </p>
        </div>

        <div class="items">
          <xsl:for-each select="rss/channel/item">
            <div class="item">
              <h3>
                <a href="{link}" target="_blank">
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <div class="item-meta">
                <span>📅 <xsl:value-of select="pubDate"/></span>
                <span>👤 <xsl:value-of select="author"/></span>
                <span>🏷️ <xsl:value-of select="category"/></span>
              </div>
              <div class="item-description">
                <xsl:value-of select="description"/>
              </div>
            </div>
          </xsl:for-each>
        </div>

        <div class="footer">
          <p>🚀 由 Vibe 博客系统强力驱动</p>
          <p>最后更新：<xsl:value-of select="rss/channel/lastBuildDate"/></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

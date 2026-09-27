TimmEstate — Blog + 12 Article Detail Pages
=============================================

WHAT'S IN THIS ZIP
- /blog/               -> blog.html, blog.css, index.js (updated: all 12 cards now link out)
- /blog-details-1/  ... /blog-details-12/
    each folder = one fully self-contained article page:
    blog-details.html, blog-details.css, index.js

HOW TO USE
1. Drop the /blog folder and all 12 /blog-details-N folders into your
   project's root, alongside your existing index.html, about.html,
   contact.html, listing/, etc.
2. Double-check these relative paths actually match your real folder
   names (I guessed based on earlier conversation):
     ../about us/about.html
     ../contact us/contact.html
     ../listing/index.html
     ../blog/blog.html
   If any of your folder names are different, find-and-replace that
   path across all 13 HTML files.
3. Every folder needs its own real photo. I used placeholder filenames
   matching what you already had (blog-1-luxury-market-outlook.png,
   blog-2-beverly-grove-community.png, etc.) plus these NEW ones you'll
   need to add images for:
     - author-hammed.png       (author avatar, reused on all 12 pages)
     - commenter-1.png         (reused on all 12 pages)
     - commenter-2.png         (reused on all 12 pages)
   Every article's hero image is just its matching blog-N-*.png file
   from your existing blog folder — copy those into each blog-details-N
   folder too, since the <img> tags reference them by filename.
4. All Lorem ipsum has been replaced with real, unique content matching
   each article's title, topic, and category.

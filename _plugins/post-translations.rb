# Pairs each Chinese translation in the `posts_zh` collection with the English
# post in `_posts` that has the same filename, and links the two together.
#
# Both documents get `translation_url` and `translation_lang`, which the post
# layout uses for the language switch and the <head> hreflang links. The
# translation always takes the English post's `date` (the filename only holds
# the day), and inherits `tags` and `categories` unless it sets its own.
Jekyll::Hooks.register :site, :post_read do |site|
  zh_collection = site.collections["posts_zh"]
  next unless zh_collection

  en_posts = site.posts.docs.to_h { |doc| [doc.basename, doc] }
  default_lang = site.config["lang"] || "en-US"

  zh_collection.docs.each do |zh|
    en = en_posts[zh.basename]
    unless en
      Jekyll.logger.warn "Translations:", "#{zh.relative_path} has no matching English post in _posts/"
      next
    end

    zh.data["date"] = en.data["date"]
    %w[tags categories].each do |key|
      zh.data[key] = en.data[key] if Array(zh.data[key]).empty?
    end

    en.data["translation_url"] = zh.url
    en.data["translation_lang"] = zh.data["lang"]
    zh.data["translation_url"] = en.url
    zh.data["translation_lang"] = en.data["lang"] || default_lang
  end
end

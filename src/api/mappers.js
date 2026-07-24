export const pickLang = lang => (item, key) => {
  if (!item) return undefined;
  const arKey = `${key}_ar`;
  const enKey = `${key}_en`;
  return lang === 'ar' ? (item[arKey] ?? item[enKey]) : (item[enKey] ?? item[arKey]);
};

export const mapProduct = (p, lang = 'en') => {
  const get = pickLang(lang);
  return {
    id: p.id,
    image: p.image,
    title: get(p, 'title'),
    description: get(p, 'description'),
    price: p.price,
    discountPrice: p.discount_price,
    currency: p.currency,
    usdEquivalent: p.usd_equivalent,
    rating: p.rating,
    reviewCount: p.review_count,
    tag: p.tag,
    tagType: p.tag_type,
    isNew: p.is_new,
    isFavorite: p.is_favorite,
    colors: p.colors,
    sizes: p.sizes,
    categoryId: p.category_id,
    subcategoryId: p.subcategory_id,
    syp_price: p.price_syp,
    syp_discountPrice: p.discount_price_syp,
  };
};


export const mapSingleProduct = (p, lang = 'en') => {
  const get = pickLang(lang);

  return {
    id: p.id,
    image: p.image,
    title: get(p, 'title'),
    description: get(p, 'description'),
    price: p.price,
    discountPrice: p.discount_price,
    currency: p.currency,
    usdEquivalent: p.usd_equivalent,
    rating: p.rating,
    reviewCount: p.review_count,
    tag: p.tag,
    tagType: p.tag_type,
    isNew: p.is_new,
    isFavorite: p.is_favorite,
    colors: p.colors,
    sizes: p.sizes,
    categoryId: p.category_id,
    subcategoryId: p.subcategory_id,
  };
};




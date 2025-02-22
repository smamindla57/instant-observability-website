import CATEGORIES from '@data/instant-observability-categories';
import { rank } from '@utils/searchRanking';

/**
 * Callback function for alphabetical sort.
 * @param {Object} quickstart node
 * @param {Object} quickstart node
 * @returns {Number}
 */
const alphaSort = (a, b) => a.title.localeCompare(b.title);

/**
 * Callback function for moving codestream to the front of array
 * @param {Object} quickstart node
 * @param {Object} quickstart node
 * @returns {Number}
 */
const shiftCodestream = (a, b) => {
  const codestreamId = '29bd9a4a-1c19-4219-9694-0942f6411ce7';
  if (a.id === codestreamId) {
    return 1;
  }
  if (b.id === codestreamId) {
    return 1;
  }
  return 0;
};

/**
 * Curried function for filtering by keyword
 * @param {Array} array of quickstarts
 * @param {(Function) => Array} Callback function that filters quickstart array
 */
const filterQuickstarts = (quickstarts) => (keyword) =>
  quickstarts.filter((product) => product.keywords.includes(keyword));

/**
 * Determines if one string is a substring of the other, case insensitive
 * @param {String} substring the substring to test against
 * @returns {(Function) => Boolean} Callback function that determines if the argument has the substring
 */
const stringIncludes = (substring) => (fullstring) =>
  fullstring.toLowerCase().includes(substring.toLowerCase());

/**
 * Filters a quickstart based on a provided search term.
 * @param {String} search Search term.
 * @returns {(Function) => Boolean} Callback function to be used by filter.
 */
const filterBySearch = (search) => ({
  title,
  summary,
  description,
  keywords,
}) => {
  if (!search) {
    return true;
  }

  const searchIncludes = stringIncludes(search);
  return (
    searchIncludes(title) ||
    searchIncludes(summary) ||
    searchIncludes(description) ||
    keywords.some(searchIncludes)
  );
};

/**
 * Filters a quickstart based on a category.
 * @param {String} category The category type (e.g. 'featured').
 * @returns {(Function) => Boolean} Callback function to be used by filter.
 */
const filterByCategory = (category) => {
  const { associatedKeywords = [] } =
    CATEGORIES.find(({ value }) => value === category) || {};

  return (quickstart) =>
    !category ||
    (quickstart.keywords &&
      quickstart.keywords.find((k) => associatedKeywords.includes(k)));
};

/**
 * Custom hook to get filtered quickstarts
 * @param {Array} array of quickstarts
 */
const allFilteredQuickstarts = (quickstarts, search, category) => {
  const trimmedSearch = search.trim();
  const filterQuickstartsByKeyword = filterQuickstarts(quickstarts);
  const featuredQuickstarts = filterQuickstartsByKeyword('featured');
  const mostPopularQuickstarts = filterQuickstartsByKeyword('most popular');
  const sortedQuickstarts = quickstarts.sort(alphaSort).sort(shiftCodestream);

  const filteredQuickstarts = sortedQuickstarts
    .filter(filterBySearch(trimmedSearch))
    .filter(filterByCategory(category))
    .sort((a, b) => rank(b, trimmedSearch) - rank(a, trimmedSearch));

  const categoriesWithCount = CATEGORIES.map((cat) => ({
    ...cat,
    count: sortedQuickstarts
      .filter(filterBySearch(search))
      .filter(filterByCategory(cat.value)).length,
  }));

  return {
    featuredQuickstarts,
    filteredQuickstarts,
    mostPopularQuickstarts,
    categoriesWithCount,
  };
};

export default allFilteredQuickstarts;

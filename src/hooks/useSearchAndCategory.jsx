import { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useTessen } from '@newrelic/gatsby-theme-newrelic';
import CATEGORIES from '@data/instant-observability-categories';

const useSearchAndCategory = (location) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const tessen = useTessen();

  // used to update search and category values
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const validCategory = CATEGORIES.some((cat) => cat.value === categoryParam);

    setSearch(searchParam || '');
    setCategory(categoryParam && validCategory ? categoryParam : '');
    if (searchParam || categoryParam) {
      tessen.track({
        eventName: 'instantObservability',
        category: 'QuickstartCatalogSearch',
        search: searchParam,
        quickstartCategory: categoryParam,
      });
    }
  }, [location.search, tessen]);

  /**
   * Updates search parameter from location
   * @param {String} parameter to set
   * @param {Function => void} callback function to update search term
   */
  const handleParam = (param) => (value) => {
    if (value !== null && value !== undefined) {
      const params = new URLSearchParams(location.search);
      params.set(param, value);

      navigate(`?${params.toString()}`);

      if (param === 'category' && search) {
        params.set('search', search);
      }
    }
  };

  return {
    search,
    category,
    setSearch,
    setCategory,
    handleParam,
  };
};

export default useSearchAndCategory;

const mockRestDataSourceGet = jest.fn();

import { rawTVShow, rawTVShowDetail } from '../../../../../__tests__/mocks/tvShows.stub';
import { getImagesResult } from '../../../../../__tests__/mocks/images.stub';
import { Iso6391Language } from '../../../../../lib/types';
import { TVShowsEndpoints } from '../../../../../types';
import TVShowHandler from '.';

describe('Unity: TVShowHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrendingItem()', () => {
    describe('Fetching On the Air TV Shows', () => {
      it('should return an array of the on the air tv shows from the TheMovieDB API', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.OnTheAir,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.OnTheAir,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(false);
        expect(result.total_pages).toEqual(1);
        expect(result.total_results).toEqual(1);
      });

      it('should return the field hasMore as true when has more items to be paginated when fetching for on the air tv shows', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.OnTheAir,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.OnTheAir,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(true);
        expect(result.total_pages).toEqual(2);
        expect(result.total_results).toEqual(2);
      });
    });

    describe('Fetching Popular TV Shows', () => {
      it('should return an array of the popular tv shows from the TheMovieDB API', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.Popular,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.Popular,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(false);
        expect(result.total_pages).toEqual(1);
        expect(result.total_results).toEqual(1);
      });

      it('should return the field hasMore as true when has more items to be paginated when fetching for popular tv shows', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.Popular,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.Popular,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(true);
        expect(result.total_pages).toEqual(2);
        expect(result.total_results).toEqual(2);
      });
    });

    describe('Fetching Top Rated TV Shows', () => {
      it('should return an array of the top rated tv shows from the TheMovieDB API', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.TopRated,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.TopRated,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(false);
        expect(result.total_pages).toEqual(1);
        expect(result.total_results).toEqual(1);
      });

      it('should return the field hasMore as true when has more items to be paginated when fetching for top rated tv shows', async () => {
        mockRestDataSourceGet.mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        });

        const tvShowHandler = new TVShowHandler(mockRestDataSourceGet);

        const result = await tvShowHandler.getTrendingItem(
          {
            page: 1,
            language: Iso6391Language.Ptbr,
          },
          TVShowsEndpoints.TopRated,
        );

        expect(mockRestDataSourceGet).toHaveBeenCalledWith(
          TVShowsEndpoints.TopRated,
          { page: 1 },
          Iso6391Language.Ptbr,
        );
        expect(mockRestDataSourceGet.mock.calls.length).toBe(1);
        expect(result.items).toMatchSnapshot();
        expect(result.hasMore).toEqual(true);
        expect(result.total_pages).toEqual(2);
        expect(result.total_results).toEqual(2);
      });
    });
  });

  describe('getTVShow()', () => {
    it('should get the details of a tv show with certain id from TheMovideDB API', async () => {
      mockRestDataSourceGet.mockReturnValueOnce(rawTVShowDetail);

      const tvshowHandler = new TVShowHandler(mockRestDataSourceGet);

      const result = await tvshowHandler.getTVShow({
        id: '1',
        language: Iso6391Language.Ptbr,
      });

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        'tv/1',
        {
          append_to_response: 'credits,similar,videos',
        },
        'PTBR',
      );

      expect(mockRestDataSourceGet.mock.calls.length).toBe(1);

      expect(result).toMatchSnapshot();
    });
  });

  describe('getImages()', () => {
    it('should return an array of strings containing urls to images of a certain tv show', async () => {
      mockRestDataSourceGet.mockReturnValueOnce(getImagesResult);

      const tvshowHandler = new TVShowHandler(mockRestDataSourceGet);

      const result = await tvshowHandler.getImages('1');

      expect(mockRestDataSourceGet).toHaveBeenCalledWith('tv/1/images', {}, null);

      expect(mockRestDataSourceGet.mock.calls.length).toBe(1);

      expect(result).toMatchSnapshot();
    });
  });
});
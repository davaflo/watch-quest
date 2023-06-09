import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Credits } from '../../movies/interfaces/movies.interfaces';
import { FavoriteRequest } from '../../shared/interfaces/favorite.interface';
import { ProviderResponse } from '../../shared/interfaces/provider.interface';
import { Response } from '../../shared/interfaces/response.interface';
import { WatchlistRequest } from '../../shared/interfaces/watchlist.interface';
import {
  Series,
  SeriesDetails,
  SeriesResponse,
} from '../interfaces/series.interface';

export const SeriesActions = createActionGroup({
  source: 'Series',
  events: {
    'Load Series': props<{ category: string; page: number }>(),
    'Load Series Success': props<{
      category: string;
      series: SeriesResponse;
    }>(),
    'Load Favorite Series': emptyProps(),
    'Load Favorite Series Success': props<{
      data: { series: Series[] };
    }>(),
    'Rate Serie': props<{ rating: number; id: number }>(),
    'Rate Serie Success': props<{ rating: number; id: number }>(),
    'Load Rated Series': emptyProps(),
    'Load Rated Series Success': props<{ data: { series: SeriesDetails[] } }>(),
    'Add Favorite': props<{ data: { request: FavoriteRequest } }>(),
    'Remove Favorite': props<{ id: number }>(),
    'Add Favorite Success': props<{ data: { response: Response } }>(),
    'Add to Watchlist': props<{ data: { request: WatchlistRequest } }>(),
    'Remove From Watchlist': props<{ id: number }>(),
    'Add to Watchlist Success': props<{
      data: { response: Response };
    }>(),
    'Load Watchlist Series': emptyProps(),
    'Load Watchlist Series Success': props<{
      data: { series: SeriesDetails[] };
    }>(),
    'Load Serie Details': props<{ id: number; category: string }>(),
    'Load Serie Details Success': props<{
      data: { serie: SeriesDetails; category: string };
    }>(),
    'Load Serie Providers': props<{ id: number }>(),
    'Load Serie Providers Success': props<{
      data: { providers: ProviderResponse };
    }>(),
    'Load Serie Cast': props<{ id: number }>(),
    'Load Serie Cast Success': props<{
      data: { id: number; credits: Credits };
    }>(),
  },
});

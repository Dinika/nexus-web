import { Action, ActionCreator, Dispatch } from 'redux';
import { PaginatedList, PaginationSettings, ElasticSearchView, SparqlView } from '@bbp/nexus-sdk';
import { ElasticSearchHit } from '@bbp/nexus-sdk/lib/View/ElasticSearchView';
import { SparqlViewQueryResponse } from '@bbp/nexus-sdk/lib/View/SparqlView';
import { ThunkAction } from '..';

//
// Action types
//
interface RawQueryAction extends Action {
  type: '@@rawQuery/QUERYING';
  query: string;
  paginationSettings: PaginationSettings;
}
interface RawQueryActionSuccess extends Action {
  type: '@@rawQuery/QUERYING_SUCCESS';
  payload: any;
}
interface RawQueryActionFailure extends Action {
  type: '@@rawQuery/QUERYING_FAILURE';
}

const rawQueryAction: ActionCreator<RawQueryAction> = (query: string, paginationSettings) => ({
  query,
  paginationSettings,
  type: '@@rawQuery/QUERYING',
});
const rawQuerySuccessAction: ActionCreator<RawQueryActionSuccess> = (
  results: any,
) => ({
  type: '@@rawQuery/QUERYING_SUCCESS',
  payload: results,
});
const rawQueryFailureAction: ActionCreator<RawQueryActionFailure> = (
  error: any
) => ({
  error,
  type: '@@rawQuery/QUERYING_FAILURE',
});

export type RawQueryActions =
  | RawQueryAction
  | RawQueryActionSuccess
  | RawQueryActionFailure;

export const executeRawQuery: ActionCreator<ThunkAction> = (orgName: string, projectName: string, query: string) => {
  return async (
    dispatch: Dispatch<any>,
    getState,
    { nexus }
  ): Promise<RawQueryActionSuccess | RawQueryActionFailure> => {
    dispatch(rawQueryAction(query));
    try {
      const sparqlView = await SparqlView.get(orgName, projectName);
      const response = await sparqlView.query(query);
      const results: SparqlViewQueryResponse = response;
      return dispatch(rawQuerySuccessAction(results));
    } catch (e) {
      console.log("error", e);
      return dispatch(rawQueryFailureAction(e));
    }
  };
};

export const executeRawElasticSearchQuery: ActionCreator<ThunkAction> = (orgName: string, projectName: string, viewId: string | undefined, query: string, paginationSettings: PaginationSettings) => {
  return async (
    dispatch: Dispatch<any>,
    getState,
    { nexus }
  ): Promise<RawQueryActionSuccess | RawQueryActionFailure> => {
    dispatch(rawQueryAction(query, paginationSettings));
    try {
      const view = await ElasticSearchView.get(orgName, projectName, viewId);
      const response = await view.rawQuery(JSON.parse(query), paginationSettings);
      const results: PaginatedList<ElasticSearchHit> = response;
      return dispatch(rawQuerySuccessAction(results));
    } catch (e) {
      console.log("error", e);
      return dispatch(rawQueryFailureAction(e));
    }
  };
};
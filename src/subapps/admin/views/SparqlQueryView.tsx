import * as React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import * as queryString from 'query-string';
import { ViewList, DEFAULT_SPARQL_VIEW_ID, View } from '@bbp/nexus-sdk';
import { useNexusContext } from '@bbp/react-nexus';

import SparqlQueryContainer from '../containers/SparqlQuery';
import useNotification from '../../../shared/hooks/useNotification';
import { Button, Col, Row, Select } from 'antd';
import { getResourceLabel } from '../../../shared/utils';
import { useAdminSubappContext } from '..';
import { isNil } from 'lodash';
import { Link } from 'react-router-dom';

const { Option } = Select;
const SparqlQueryView: React.FunctionComponent = (): JSX.Element => {
  const match = useRouteMatch<{
    orgLabel: string;
    projectLabel: string;
    viewId: string;
  }>();
  const location = useLocation();
  const history = useHistory();
  const subapp = useAdminSubappContext();
  const notification = useNotification();
  const {
    params: { orgLabel, projectLabel, viewId },
  } = match;

  const [{ _results: views }, setViews] = React.useState<ViewList>({
    '@context': {},
    _total: 0,
    _results: [],
  });
  const nexus = useNexusContext();
  const query = queryString.parse(location.search).query;
  const [selectedView, setSelectedView] = React.useState<string>(
    viewId ? decodeURIComponent(viewId) : DEFAULT_SPARQL_VIEW_ID
  );

  React.useEffect(() => {
    history.replace(
      `/${
        subapp.namespace
      }/${orgLabel}/${projectLabel}/query/${encodeURIComponent(selectedView)}`
    );
  }, [selectedView]);
  const menu = (
    <Row gutter={3} justify="space-between" align="middle">
      <Col flex="auto">
        <Select
          value={selectedView as string}
          onChange={v => setSelectedView(v)}
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
        >
          {[views]
            .flat()
            .filter(
              v =>
                v['@type']?.includes('SparqlView') ||
                v['@type']?.includes('AggregateSparqlView')
            )
            .map((view: View, index: number) => {
              return (
                <Option key={index} value={view['@id']}>
                  {getResourceLabel(view)}
                </Option>
              );
            })}
        </Select>
      </Col>
      <Col flex="100px">
        <Link
          to={`/${orgLabel}/${projectLabel}/resources/${encodeURIComponent(
            viewId
          )}`}
        >
          <Button>Open View Resource</Button>
        </Link>
      </Col>
    </Row>
  );

  React.useEffect(() => {
    nexus.View.list(orgLabel, projectLabel, { deprecated: false })
      .then(result => {
        setViews(result);
      })
      .catch(error => {
        notification.error({
          message: 'Problem loading Views',
          description: error.message,
        });
      });
  }, [orgLabel, projectLabel]);

  return (
    <>
      <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>{menu}</div>
      <div className="view-view view-container -unconstrained-width">
        <SparqlQueryContainer
          orgLabel={orgLabel}
          projectLabel={projectLabel}
          initialQuery={Array.isArray(query) ? query.join(',') : query}
          viewId={encodeURIComponent(selectedView)}
        />
      </div>
    </>
  );
};

export default SparqlQueryView;

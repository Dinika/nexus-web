import { rest } from 'msw';
import { deltaPath } from '__mocks__/handlers/handlers';

export const sparqlAnalysisReportNoResultsHandler = rest.post(
  deltaPath('/views/:orgLabel/:projectLabel/graph/sparql'),
  (req, res, ctx) => {
    const mockResponse = {
      head: {
        vars: [
          'analysis_report_id',
          'analysis_report_name',
          'analysis_report_description',
          'created_by',
          'created_at',
          'asset_content_url',
          'asset_encoding_format',
          'asset_name',
          'self',
        ],
      },
      results: { bindings: [] },
    };

    return res(ctx.status(200), ctx.json(mockResponse));
  }
);

export const sparqlAnalysisReportSingleResult = rest.post(
  deltaPath('/views/orgLabel/projectLabel/graph/sparql'),
  (req, res, ctx) => {
    const mockResponse = {
      head: {
        vars: [
          'container_resource_id',
          'container_resource_name',
          'analysis_report_id',
          'analysis_report_name',
          'analysis_report_description',
          'created_by',
          'created_at',
          'asset_content_url',
          'asset_encoding_format',
          'asset_name',
          'self',
        ],
      },
      results: {
        bindings: [
          {
            analysis_report_description: {
              type: 'literal',
              value:
                "This is our analysis report. Isn't it great! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 555",
            },
            analysis_report_id: {
              type: 'uri',
              value:
                'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/MyTestAnalysisReport1',
            },
            analysis_report_name: {
              type: 'literal',
              value: 'Our Very First Analysis Report!',
            },
            asset_content_url: {
              type: 'literal',
              value:
                'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/d3d1cc48-9547-4c9c-a08f-f281ffb458cc',
            },
            asset_encoding_format: {
              type: 'literal',
              value: 'image/png',
            },
            asset_name: {
              type: 'literal',
              value: 'insta_logo_large.png',
            },
            container_resource_id: {
              type: 'uri',
              value:
                'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/MyTestAnalysis1',
            },
            container_resource_name: {
              type: 'literal',
              value: 'Analysis container',
            },
            created_at: {
              datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
              type: 'literal',
              value: '2022-06-17T04:14:06.357Z',
            },
            created_by: {
              type: 'uri',
              value:
                'https://dev.nise.bbp.epfl.ch/nexus/v1/realms/local/users/localuser',
            },
            self: {
              type: 'uri',
              value:
                'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/MyTestAnalysisReport1',
            },
          },
        ],
      },
    };

    return res(ctx.status(200), ctx.json(mockResponse));
  }
);

export const resourcesAnalysisReportType = rest.post(
  deltaPath('/resources/orgLabel/projectLabel'),
  (req, res, ctx) => {
    const mockResponse = {
      '@context': 'https://bluebrain.github.io/nexus/contexts/metadata.json',
      '@id':
        'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/2098607b-30ae-493f-9e07-38f4822a0787',
      '@type': 'https://neuroshapes.org/AnalysisReport',
      _constrainedBy:
        'https://bluebrain.github.io/nexus/schemas/unconstrained.json',
      _createdAt: '2022-06-29T12:34:49.183Z',
      _createdBy:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/realms/local/users/localuser',
      _deprecated: false,
      _incoming:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/2098607b-30ae-493f-9e07-38f4822a0787/incoming',
      _outgoing:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/2098607b-30ae-493f-9e07-38f4822a0787/outgoing',
      _project:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/projects/bbp-users/nicholas',
      _rev: 1,
      _schemaProject:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/projects/bbp-users/nicholas',
      _self:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/resources/bbp-users/nicholas/_/2098607b-30ae-493f-9e07-38f4822a0787',
      _updatedAt: '2022-06-29T12:34:49.183Z',
      _updatedBy:
        'https://dev.nise.bbp.epfl.ch/nexus/v1/realms/local/users/localuser',
    };

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json(mockResponse)
    );
  }
);
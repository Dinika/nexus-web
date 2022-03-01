import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Table,
} from 'antd';
import { Option } from 'antd/lib/mentions';
import * as React from 'react';
import { getDateString, getFriendlyTimeAgoString } from '../../utils';

const AuthorizeJiraUI = ({
  jiraAuthUrl,
  onSubmitVerificationCode: connect,
}: {
  jiraAuthUrl: string;
  onSubmitVerificationCode: (verificationCode: string) => void;
}) => {
  const [verificationCode, setVerificationCode] = React.useState('');
  return (
    <>
      <h1>We first need to connect your Jira account.</h1>

      <ol>
        <li>
          Visit Jira to log-in and authorize access to Jira from Nexus Fusion
          <br />
          <br />
          <a href={jiraAuthUrl} target="_blank">
            Authorize Jira access
          </a>
          <br />
          <br />
        </li>
        <li>
          Copy the <em>verification code</em> from step 1 into the text box
          below and click Connect.
          <br />
          <br />
          <div style={{ display: 'flex' }}>
            <div>
              <Input
                type="text"
                placeholder="Verification code"
                style={{ backgroundColor: '#fff', width: 200 }}
                value={verificationCode}
                onChange={e => setVerificationCode(e.currentTarget.value)}
              />
            </div>
            <div>
              <Button type="primary" onClick={() => connect(verificationCode)}>
                Connect
              </Button>
            </div>
          </div>
        </li>
      </ol>
    </>
  );
};

const CreateIssueUI = ({
  displayType,
  projects,
  onOk,
  onCancel,
}: {
  projects: any[];
  onOk: (project: string, summary: string) => void;
  onCancel: () => void;
  displayType: 'project' | 'resource';
}) => {
  const [summary, setSummary] = React.useState('');
  const [project, setProject] = React.useState('');

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 19, offset: 5 },
    },
  };

  return (
    <>
      <Modal footer={null} title="Create Issue" visible={true}>
        <p>
          A Jira issue will be created and linked to this Nexus{' '}
          {displayType === 'project' ? 'project' : 'resource'}
        </p>
        <Form onFinish={() => onOk(project, summary)}>
          <Form.Item
            label="Project"
            name="project"
            rules={[
              {
                required: true,
              },
            ]}
            {...formItemLayout}
          >
            <Select
              style={{ width: 120 }}
              onChange={(value: string) => setProject(value)}
            >
              {projects.map(project => (
                <Option key={project.key} value={project.key}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Summary"
            name="summary"
            rules={[
              {
                required: true,
              },
            ]}
            {...formItemLayout}
          >
            <Input
              type="text"
              value={summary}
              onChange={e => setSummary(e.currentTarget.value)}
              placeholder="Issue Summary"
            />
          </Form.Item>
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button danger onClick={() => onCancel()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const LinkIssueUI = ({
  onOk,
  onCancel,
  searchJiraLink,
}: {
  onOk: (issueUrl: string) => void;
  onCancel: () => void;
  searchJiraLink: string;
}) => {
  const [issueKey, setIssueUrl] = React.useState('');
  return (
    <>
      <Modal
        title="Link Issue"
        visible={true}
        onOk={() => onOk(issueKey)}
        onCancel={() => onCancel()}
      >
        <a href={searchJiraLink} target="_blank">
          Search for issue in Jira
        </a>
        <br />
        <br />
        <Input
          type="text"
          value={issueKey}
          onChange={e => setIssueUrl(e.currentTarget.value)}
          placeholder="Jira Issue URL"
        />
      </Modal>
    </>
  );
};

type JIRAPluginUIProps = {
  projects: any[];
  issues: any[];
  onCreateIssue: (project: string, summary: string) => void;
  onLinkIssue: (issueKey: string) => void;
  onUnlinkIssue: (issueKey: string) => void;
  searchJiraLink: string;
  displayType: 'resource' | 'project';
};
const JIRAPluginUI = ({
  projects,
  issues,
  onCreateIssue,
  onLinkIssue,
  onUnlinkIssue,
  searchJiraLink,
  displayType,
}: JIRAPluginUIProps) => {
  const [createIssueVisible, setCreateIssueVisible] = React.useState(false);
  const [linkIssueVisible, setLinkIssueVisible] = React.useState(false);

  const confirmUnlinkIssue = (issueKey: string) => {
    Modal.confirm({
      title: 'Unlink Issue',
      content:
        'Are you sure you want to unlink the issue from this Nexus resource?',
      onOk: () => {
        onUnlinkIssue(issueKey);
        return Promise.resolve();
      },
    });
  };

  return (
    <>
      {createIssueVisible && (
        <CreateIssueUI
          displayType={displayType}
          projects={projects}
          onOk={(project, summary) => {
            onCreateIssue(project, summary);
            setCreateIssueVisible(false);
          }}
          onCancel={() => setCreateIssueVisible(false)}
        />
      )}
      {linkIssueVisible && (
        <LinkIssueUI
          searchJiraLink={searchJiraLink}
          onOk={issueUrl => {
            onLinkIssue(issueUrl);
            setLinkIssueVisible(false);
          }}
          onCancel={() => setLinkIssueVisible(false)}
        />
      )}

      {issues.length > 0 && (
        <div style={{ width: '100%', display: 'flex', marginBottom: '10px' }}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="create"
                  onClick={() => setCreateIssueVisible(true)}
                >
                  Create issue
                </Menu.Item>
                <Menu.Item key="link" onClick={() => setLinkIssueVisible(true)}>
                  Link issue
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="primary" style={{ marginLeft: 'auto' }}>
              Add <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      )}

      {issues.length === 0 && (
        <Empty description="No linked issues.">
          <Button type="primary" onClick={() => setCreateIssueVisible(true)}>
            Create Issue
          </Button>{' '}
          or{' '}
          <Button type="default" onClick={() => setLinkIssueVisible(true)}>
            Link Existing Issue
          </Button>
        </Empty>
      )}

      {issues.length > 0 && (
        <Table
          size="small"
          dataSource={issues}
          columns={[
            displayType === 'project'
              ? {
                  title: 'Link type',
                  render: issue => (issue.resourceId ? 'Resource' : 'Project'),
                }
              : {},
            {
              title: 'Issue',
              render: issue => {
                return (
                  <a href={issue.url} target="_blank">
                    {issue.summary}
                  </a>
                );
              },
            },
            displayType === 'project'
              ? {
                  title: 'Resource',
                  render: issue => issue.resourceId,
                }
              : {},
            {
              title: 'Last updated',
              render: issue => {
                return <>{getFriendlyTimeAgoString(issue.updated)}</>;
              },
            },
            {
              title: 'Status',
              render: issue => {
                return <>{issue.status}</>;
              },
            },
            {
              title: 'Comments',
              render: issue => {
                return <>{issue.commentCount}</>;
              },
            },
            {
              key: 'id',
              render: issue => {
                return (
                  <>
                    <Dropdown.Button
                      size="small"
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="unlink"
                            onClick={() => confirmUnlinkIssue(issue.key)}
                          >
                            Unlink
                          </Menu.Item>
                        </Menu>
                      }
                      // onClick={() => window.open(issue.url, '_blank')}
                    >
                      Options
                    </Dropdown.Button>
                  </>
                );
              },
            },
          ]}
        />
      )}
    </>
  );
};

export default JIRAPluginUI;
export { AuthorizeJiraUI };

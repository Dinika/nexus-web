import * as React from 'react';
import { useParams } from 'react-router';
import StudioListContainer from '../containers/StudioListContainer';
import { Link } from 'react-router-dom';

const StudioAdminView: React.FunctionComponent<{}> = () => {
  // @ts-ignore
  const { orgLabel, projectLabel } = useParams();
  return (
    <div className="view-container">
      <div className="global-studio-list">
        <div
          className="project-banner no-bg"
          style={{
            marginBottom: 20,
          }}
        >
          <div className="label">
            <h1 className="name">
              <span>
                <Link role="link" to={`/admin/${orgLabel}`}>
                  {orgLabel}
                </Link>
                {' | '}
                <Link role="link" to={`/admin/${orgLabel}/${projectLabel}`}>
                  {projectLabel}
                </Link>
              </span>
            </h1>
          </div>
        </div>
        {orgLabel && projectLabel && (
          <StudioListContainer
            orgLabel={orgLabel}
            projectLabel={projectLabel}
          />
        )}
      </div>
    </div>
  );
};

export default StudioAdminView;

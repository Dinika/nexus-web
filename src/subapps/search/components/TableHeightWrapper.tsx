import * as React from 'react';
import { Table } from 'antd';
import { Bounds } from '../../../shared/hooks/useMeasure';

const TableHeightWrapper: React.FC<{
  wrapperHeightRef: React.MutableRefObject<HTMLDivElement>;
  resultTableHeightTestRef: React.MutableRefObject<HTMLDivElement>;
  wrapperDOMProps: Bounds;
}> = ({
  wrapperHeightRef,
  resultTableHeightTestRef,
  wrapperDOMProps,
  children,
}) => {
  return (
    <div className="height-test-wrapper">
      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <div
          className="height-tester"
          ref={wrapperHeightRef}
          style={{ margin: '0' }}
        >
          <div
            ref={resultTableHeightTestRef}
            className={'result-table heightTest'}
            style={{ display: 'none', opacity: '0' }}
          >
            <div className="search-table">
              <Table
                key="HeightTestTable"
                dataSource={[
                  {
                    key: '1',
                    name: 'HeightTest',
                  },
                ]}
                columns={[
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: value => (
                      <div className="row-selection-checkbox">
                        <span className="row-index">1</span>
                      </div>
                    ),
                  },
                ]}
                rowSelection={{}}
                pagination={false}
              ></Table>
            </div>
          </div>
          <div
            className="result-table"
            style={{
              height: wrapperDOMProps.height,
              overflow: 'auto',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableHeightWrapper;

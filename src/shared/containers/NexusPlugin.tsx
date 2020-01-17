/**
 * This component requires SystemJS to be available globally (in window)
 */
import * as React from 'react';
import invariant from 'ts-invariant';
import { NexusClient, Resource } from '@bbp/nexus-sdk';
import { useNexusContext } from '@bbp/react-nexus';

const warningMessage =
  'SystemJS not found. ' +
  'To load plugins, Nexus Web requires SystemJS to be available globally.' +
  ' You can find out more here https://github.com/systemjs/systemjs';

export type NexusPluginProps<T = any> = {
  url: string;
  resource: Resource<T>;
};

export type NexusPluginClassProps<T = any> = NexusPluginProps<T> & {
  nexusClient: NexusClient;
};

export class NexusPlugin extends React.Component<
  NexusPluginClassProps,
  { hasError: boolean; loading: boolean }
> {
  private container: React.RefObject<HTMLDivElement>;
  private pluginCallback: () => void;

  constructor(props: NexusPluginClassProps) {
    super(props);
    this.state = { hasError: false, loading: true };
    this.container = React.createRef();
    this.pluginCallback = () => {};
    // @ts-ignore
    invariant(window.System, warningMessage);
  }

  componentDidCatch(e: Error) {
    this.setState({ hasError: true, loading: false });
  }

  componentDidMount() {
    // @ts-ignore
    window.System.import(this.props.url)
      .then(
        (module: {
          default: ({
            ref,
            nexusClient,
            resource,
          }: {
            ref: HTMLDivElement | null;
            nexusClient?: NexusClient;
            resource: Resource;
          }) => () => void;
        }) => {
          this.setState({
            hasError: false,
            loading: false,
          });
          this.pluginCallback = module.default({
            ref: this.container.current,
            nexusClient: this.props.nexusClient,
            resource: this.props.resource,
          });
        }
      )
      .catch((error: Error) => {
        this.setState({ hasError: true, loading: false });
      });
  }

  componentWillUnmount() {
    this.pluginCallback();
  }

  render() {
    if (this.state.hasError) {
      return <p>Error loading plugin {this.props.url}</p>;
    }
    if (this.state.loading) {
      return <p>loading plugin {this.props.url}...</p>;
    }
    return <div className="remote-component" ref={this.container}></div>;
  }
}

const HigherOrderNexusPlugin: React.FC<NexusPluginProps> = props => {
  const nexus = useNexusContext();

  return <NexusPlugin nexusClient={nexus} {...props} />;
};

export default HigherOrderNexusPlugin;
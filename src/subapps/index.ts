import { RouteProps } from 'react-router';
import Admin from './admin';
import StudioLegacy from './studioLegacy';
import Workflow from './projects';
import Search from './search';

export type SubAppObject = {
  subAppType: string;
  title: string;
  namespace: string;
  routes: RouteProps[];
  icon?: string;
  url?: string;
  requireLogin?: boolean;
  description?: string;
  version?: string;
};

export type SubApp = () => SubAppObject;

const SubApps: Map<string, SubApp> = new Map();

SubApps.set('Search', Search);
SubApps.set('StudioLegacy', StudioLegacy);
SubApps.set('Workflow', Workflow);
SubApps.set('Admin', Admin);

export default SubApps;

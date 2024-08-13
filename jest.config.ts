import {getJestProjects} from '@nrwl/jest';

export default {
    projects: [...getJestProjects(), './libs/*/jest.config.ts', './apps/*/jest.config.ts'],
};

import { SSTConfig } from "sst";
import { Tags } from 'aws-cdk-lib';
import { App } from "./stacks/App";

export default {
  config(_input) {
    return {
      name: "rocket-tower-poll-bot",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    // Tagging
    const tags = Tags.of(app);
    tags.add('Project', app.name);
    tags.add('Region', app.region);
    tags.add('Env', app.stage);

    // Removal policy
    if (app.stage === 'prod') {
      app.setDefaultRemovalPolicy('retain-on-update-or-delete');
    } else {
      app.setDefaultRemovalPolicy('destroy');
    }

    // Resources configuration
    app.setDefaultFunctionProps({
      runtime: 'nodejs20.x',
    });

    app.stack(App);
  }
} satisfies SSTConfig;

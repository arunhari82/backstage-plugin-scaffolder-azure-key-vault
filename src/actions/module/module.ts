import { coreServices, createBackendModule } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint  } from '@backstage/plugin-scaffolder-node/alpha';
import { readSecretsAction } from "../azure-key-vault/azure-key-vault";


/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderModule = createBackendModule({
  moduleId: 'azure-key-vault:getSecrets',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scaffolderActions: scaffolderActionsExtensionPoint
      },
      async init({ logger,config,scaffolderActions}) {
        scaffolderActions.addActions(readSecretsAction({config,logger}));
      },
      
    });
  },
})

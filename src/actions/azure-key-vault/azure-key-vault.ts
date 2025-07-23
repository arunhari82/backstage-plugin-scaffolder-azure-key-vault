import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { AzureKeyVaultService } from '../azure-service/azure-service';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
/**
 * Creates an `acme:example` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://example.com} for more information.
 *
 * @public
 */

export function readSecretsAction(options: { config: Config; logger: LoggerService }) { 
    const { config, logger } = options;
    return createTemplateAction<{
  secretNames: string[];
}>({
  id: 'azure-key-vault:getSecrets',
  description: 'Retrieves secret from Azure Key Vault. Required config.d.ts configured with oauth application with AzureVaultUrl,TenantID,ClientId,ClientSecret',
  schema: {
    input: z.object({
      secretNames: z.array(z.string()).describe('List of Secret Names'),
    }),
    output: z.object({
      result: z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      ).describe('Array of secret values'),
    }),
  },
async handler(ctx) {
    const { secretNames } = ctx.input;
    logger.info("Extracting Secret from Azure Key Vault");
    var service = AzureKeyVaultService.fromConfig(config,options);
    var result = await service.getSecrets(secretNames);
    //logger.info("Final result before response : " + JSON.stringify(result) );
    var finalResult = []
    for(var i=0;i<result.length;i++)
    {
        finalResult.push({
            key: result[i].key,
            value : result[i].value? result[i].value : ""
        })
    }
    logger.info("Final result before response : " + JSON.stringify(finalResult));
    ctx.output('result', finalResult);
  },

})
};
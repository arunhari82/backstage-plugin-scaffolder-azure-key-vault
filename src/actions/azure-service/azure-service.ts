import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';
import { SecretEntry } from '../../types/azure-key-vault-types';

export class AzureKeyVaultService {

    private readonly logger: LoggerService;
    private readonly config: Config;

    private readonly tenantid : string;
    private readonly clientId : string;
    private readonly clientSecret : string;
    private readonly vaultURI : string;
   

    private constructor(
        logger: LoggerService,
        config: Config,
      ) {
        this.logger = logger;
        this.config = config;
        try
        {
            this.tenantid = this.config.getString("AzureKeyVaultConfig.tenantId");
            this.clientId = this.config.getString("AzureKeyVaultConfig.clientId");
            this.clientSecret = this.config.getString("AzureKeyVaultConfig.clientSecret");
            this.vaultURI = this.config.getString("AzureKeyVaultConfig.vaultURI");
            this.logger.info("Loaded Azure Key Vault Config : ")
            this.logger.info("Loaded Azure Key Vault Tenant ID : " + this.tenantid)
            this.logger.info("Loaded Azure Key Vault clientId : " + this.clientId)
        }catch(e : unknown)
        {
            this.logger.error("Unable to find required config please configure AzureKeyVaultConfig in app-config")
            throw new Error(
            "Unable to find required config please configure AzureKeyVaultConfig in app-config " + e,
          );
        }
    }

    static fromConfig(config: Config,
        options: { logger: LoggerService })
    {
         return new AzureKeyVaultService(options.logger,config)
    }

    public async getSecrets(secretNames : string[]): Promise<SecretEntry[]>
    {
        var credentials : ClientSecretCredential = new ClientSecretCredential(this.tenantid,this.clientId,this.clientSecret);
        const client : SecretClient = new SecretClient(this.vaultURI,credentials);
        var result : SecretEntry[] = []
        secretNames.forEach(async (name) => {
            var secret = await client.getSecret(name);
            var output : SecretEntry = {
                key: secret.name,
                value: secret.value ? secret.value : ""
            }
            result.push(output);
        });

        return result;
    }
    
}
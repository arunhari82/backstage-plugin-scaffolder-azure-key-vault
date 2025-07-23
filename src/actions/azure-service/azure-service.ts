import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';
import { SecretEntry } from '../../types/azure-key-vault-types';

/**
 * This service actually interacts with Azure Key Vault via Oauth API
 * tenantid,clientId,clientSecret,vaultURI are expected to configured under AzureKeyVaultConfig in app-config.yaml
 * it uses these values to authenticate and perform required action.
 */

export class AzureKeyVaultService {

    private readonly logger: LoggerService;
    private readonly config: Config;

    private readonly tenantid : string;
    private readonly clientId : string;
    private readonly clientSecret : string;
    private readonly vaultURI : string;
   
   // This is private constructor as we want to follow a singleton pattern.
    private constructor(
        logger: LoggerService,
        config: Config,
      ) {
        this.logger = logger;
        this.config = config;
        try
        {
            // Reading from app-config.yaml
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

    // This method is used to create an instance of this class.
    static fromConfig(config: Config,
        options: { logger: LoggerService })
    {
         return new AzureKeyVaultService(options.logger,config)
    }

    // This method authenticates with Azure with the values from app-config and fetches value of secrets from Azure Key vault
    public async getSecrets(secretNames : string[]): Promise<SecretEntry[]>
    {
        // Authenticate
        var credentials : ClientSecretCredential = new ClientSecretCredential(this.tenantid,this.clientId,this.clientSecret);
        
        // Create keyVaultClient to fetch values
        const client : SecretClient = new SecretClient(this.vaultURI,credentials);

        var result : SecretEntry[] = []
        for(var i=0;i<secretNames.length;i++)
        {
            var secret = await client.getSecret(secretNames[i]);
            var output : SecretEntry = {
                key: secret.name,
                value: secret.value ? secret.value : ""
            }
            this.logger.info("Azure vault value Fetched Value is : " + secret.name + " -> " + secret.value);
            result.push(output);
        }
        this.logger.info("Azure Fetch Results is : " + JSON.stringify(result));
        return result;
    }
    
}
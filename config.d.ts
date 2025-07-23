export interface Config {
    /** Optional configurations for the Azure WorkItem */
    /**
     * Configuration to fetch secrets for scaffolder.
     * @visibility backend
     */
    AzureKeyVaultConfig?: {
      /**
       * Oauth Application Tenant ID . This Oauth Application should have access to Azure Vault (Permission: Key Vault Secret User)
       * @visibility backend
       */
      tenantId: string;
      /**
       *  Oauth Application Client ID.
       * @visibility backend
       */
      clientId: string;
      /**
       *  Oauth Application Client Secret.
       * @visibility backend
       */
      clientSecret: string;
      /**
       * Azure Key Vault URI.
       * @visibility backend
       */
      vaultURI: string;
    }
}
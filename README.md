# backstage-plugin-scaffolder-backend-module-azure-key-vault

Welcome to Azure Key Vault Scaffolding action plugin. This plugin provides a custom action 
```
   azure-key-vault:getSecrets
``` 
that help retreive the value for Azure Key Vault(AKV) 

## Architecture

The logical flow explains how this plugin works.

![Architecture](/docs/azure-key-vault.png)

## Azure Prerequiste

### Microsoft Entra (App Register)

Register a new App with Microsoft Entra ID (https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) and collect `TenantID,ClientID`. Under `Certificate and Secrets` create a client secret. and collect `ClientSecret`

![Oauth App](/docs/azure-oauth-app-registration.png)
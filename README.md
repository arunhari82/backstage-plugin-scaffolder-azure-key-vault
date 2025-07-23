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

### Create Key Vault and assign role

Create the Key vault and note down the `Vault URI` and assign a role via Access Control (IAM) menu to the registered app


Role Required : (Key Vault Secrets User) This gives only read access to vault
![Assign Role](/docs/azure-register-app-assign-role.png)

# Compiling and packaging the plugin

```
    Note : Update the scope @anattama -> what you prefer in package.json file before compiling and packaging.
```    
## Install dependencies

```
    yarn install
```    

## Compile for Dynamic plugin
```
      yarn clean
      yarn tsc
      yarn build
      yarn export-dynamic
```

## Setup .npmrc file
   This file is located in home directory as a hidden file. We need to update this file to reflect the right npmregistry

   Sample .npmrc file shown below In this case Azure Artifactory is being used as npmregistry but we can also uses Nexus,Jfrog artifactory.

   Scope `@anattama:registry` tells the `npm publish` to point which registry


```
  ;//nexus-nexus.apps.cluster-jtdkc.sandbox251.opentlc.com/repository/:_authToken=<<Nexus Token>>
            @anattama:registry=https://pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/registry/
            always-auth=true
            ; begin auth token
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/registry/:username=anattama
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/registry/:_password=<<BASE64 Encoded Token>>
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/registry/:email=<<email_address>>
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/:username=anattama
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/:_password=<<BASE64 Encoded Token>>
            //pkgs.dev.azure.com/anattama/_packaging/mynpmregsitry/npm/:email=<<email_address>>
            ; end auth token
          
```        



## Package and Publish 

```
     cd dist-dynamic
     npm pack . --json > ../npminfo.json #This will provide SHA integrity for the pacakage
     npm publish # Depending on scope @ in package.json the .npmrc file will decide where to push the package.
```

# Injecting plugin into DevHub

### Plugin Architecture Injection
      
![Dynamic Plugin Injection](/docs/dynamic-plugin-injection.png)



# backstage-plugin-scaffolder-backend-module-azure-key-vault

Welcome to Azure Key Vault Scaffolding action plugin. This plugin provides a custom action 
```
   azure-key-vault:getSecrets
``` 
that help retreive the value for Azure Key Vault(AKV) 

## 1. Architecture

The logical flow explains how this plugin works.

![Architecture](/docs/azure-key-vault.png)

## Azure Prerequiste

### Microsoft Entra (App Register)

Register a new App with Microsoft Entra ID (https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) and collect `TenantID,ClientID`. Under `Certificate and Secrets` create a client secret. and collect `ClientSecret`

![Oauth App](/docs/azure-oauth-app-registration.png)

### Create Key Vault and assign role

Create the Key vault and note down the `Vault URI` and assign a role via Access Control (IAM) menu to the registered app

```
   Note :- All the values noted will be used in section 3 while updating app-config.yaml 
```

Role Required : (Key Vault Secrets User) This gives only read access to vault
![Assign Role](/docs/azure-register-app-assign-role.png)

# 2.Compiling and packaging the plugin

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

# 3.Injecting plugin into DevHub

### Plugin Architecture Injection
      
![Dynamic Plugin Injection](/docs/dynamic-plugin-injection.png)

## Deploying the plugin with Dev Hub.

### setup secret `dynamic-plugins-npmrc`

This secret contains the registry information please refer to runtime section of architecture diagram above. Sample secret yaml below

```
      kind: Secret
      apiVersion: v1
      metadata:
            name: dynamic-plugins-npmrc
            namespace: backstage
      data:
         .npmrc: <<BASE64 Encoded file content of .npmrc file>>
      type: Opaque

```

Note : this secret must be named as `dynamic-plugins-npmrc` and it should exists in the same namespace  as devhub installed namespace.

### Updating the dynamic plugin config map.
Add the following section to the dynamic plugin configmap

```
      - package: '@<<scope>>/backstage-plugin-scaffolder-azure-key-vault-dynamic@<<Version>>'
        integrity: <<SHA from npminfo.json>>
        disabled: false
```           

### Updating the `app-config` configmap

This plugin requires the following configuration at root level as defined in `config.d.ts` file

```
 AzureKeyVaultConfig:
    tenantId: "<<TENANT ID from OAUTH>>"
    clientId: "<<CLIENT ID from OAUTH>>"
    clientSecret: "<<CLIENTSECRET from OAUTH>>"
    vaultURI: "<<AZURE KEY VAULT URI>>"
```

# 4.Verify custom action by this plugin

Goto `https://<devhubhome>/create/actions` verify the new scaffolding action is shown

![Installed Actions](/docs/installed%20actions.png)

# 5.Execute the Template using this custom action
  Please refer file `template/azure-get-secret-template-v1.1.yaml`
/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { NetworkManagementClient } from "@azure/arm-network";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Delete Rule Collection Group Draft.
 *
 * @summary Delete Rule Collection Group Draft.
 * x-ms-original-file: specification/network/resource-manager/Microsoft.Network/stable/2024-01-01/examples/FirewallPolicyRuleCollectionGroupDraftDelete.json
 */
async function deleteFirewallRuleCollectionGroupDraft() {
  const subscriptionId = process.env["NETWORK_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["NETWORK_RESOURCE_GROUP"] || "rg1";
  const firewallPolicyName = "firewallPolicy";
  const ruleCollectionGroupName = "ruleCollectionGroup1";
  const credential = new DefaultAzureCredential();
  const client = new NetworkManagementClient(credential, subscriptionId);
  const result = await client.firewallPolicyRuleCollectionGroupDrafts.delete(
    resourceGroupName,
    firewallPolicyName,
    ruleCollectionGroupName,
  );
  console.log(result);
}

async function main() {
  deleteFirewallRuleCollectionGroupDraft();
}

main().catch(console.error);

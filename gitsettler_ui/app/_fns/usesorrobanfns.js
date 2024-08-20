
import {
    Contract, SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    nativeToScVal, Address
} from "@stellar/stellar-sdk";
import { userSignTransaction} from './fns';
import { getPublicKey } from '@stellar/freighter-api';



let rpcUrl = "https://soroban-testnet.stellar.org";

let contractAddress = 'CCYJRBJ2BSLX3OW2F752T66RZMSOOIXXET4UTQUTFXB5W3E446WU6GVW'

const accountToScVal = (account) => new Address(account).toScVal();

const stringToSymbol = (value) => {
    return nativeToScVal(value, {type: "symbol"})
}

const numberToI128 = (value) => {
    return nativeToScVal(value, {type: "i128"})
}



const numberToU64= (value) => {
    return nativeToScVal(value, {type: "u64"})
}

let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}


async function contractInt(caller, functName, values) {
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const contract = new Contract(contractAddress);
    const sourceAccount = await provider.getAccount(caller);
    let buildTx;
    if (values == null) {
        buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName))
        .setTimeout(30).build();
    }
    else {
        buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30).build();
    }
    let _buildTx = await provider.prepareTransaction(buildTx);
    let prepareTx = _buildTx.toXDR();
    let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);
    let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);
    try {
        let sendTx = await provider.sendTransaction(tx).catch(function (err) {
            return err;
        });
        if (sendTx.errorResult) {
            throw new Error("Unable to submit transaction");
        }
        if (sendTx.status === "PENDING") {
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    } catch (err) {
        return err;
    }
}


async function addIssueSoroban(issueId, poster, githubName, repositoryName, reward, endTime) {
    // let caller = await  getPublicKey();
    console.log(issueId, poster, githubName, repositoryName, reward, endTime)
 
    let values = [
      numberToU64(issueId),
      accountToScVal(poster),
      stringToSymbol(githubName),
      stringToSymbol(repositoryName),
      numberToI128(reward),
      stringToSymbol(endTime)
    ];
    let result = await contractInt(poster, 'add_issue', values);
    console.log(result);
    return true
  }

  
   async function soroAddIssue(issueId, poster, githubName, repositoryName, reward, endTime) {
    let issue_id = numberToU64(issueId)
    let posterValue = accountToScVal(poster)
    let github_name = stringToSymbol(githubName)
    let repository_name = stringToSymbol(repositoryName)
    let rewardValue = numberToI128(reward)
    let end_time = stringToSymbol(endTime)
    let values = [issue_id, posterValue, github_name, repository_name, rewardValue, end_time]
    let result = await contractInt(posterValue, 'add_issue', values);
    console.log(result)
    return true
  }



  export { addIssueSoroban, soroAddIssue }
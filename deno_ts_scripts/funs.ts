import { Contract, SorobanRpc, TransactionBuilder, Networks,
    BASE_FEE, 
    Keypair, nativeToScVal, Address } from "npm:@stellar/stellar-sdk";




let rpcUrl = "https://soroban-testnet.stellar.org"

let contractAddress = 'CCYJRBJ2BSLX3OW2F752T66RZMSOOIXXET4UTQUTFXB5W3E446WU6GVW'


let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}




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





export async function contractInt(functName, values) {
    const kp = Keypair.fromSecret("SCD5BHD4NPBH24J2G6EVIBNSMWHOSGX7J3K6QXCZYDWUEMQJOXXYDOFB");
    const caller = kp.publicKey();
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress);
    let buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30)
        .build();
    let prepareTx = await provider.prepareTransaction(buildTx);
    prepareTx.sign(kp);
    try {
        let sendTx = await provider.sendTransaction(prepareTx).catch(function (err) {
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




// client.initialize(admin,   &10);

export async function initialize() {
    let admin = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
    let commission = numberToI128(10)
    let values = [admin, commission]
    let result = await contractInt('initialize', values);
    console.log(result)

}





export async function addIssue() {
    let issue_id = numberToU64(7)
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
    let  github_name  = stringToSymbol("gitname7")
    let  repository_name  = stringToSymbol("reponame7")
    let reward = numberToI128(10)
    let end_time = stringToSymbol("June10")
    let values = [issue_id,poster, github_name, repository_name, reward, end_time]
    let result = await contractInt('add_issue', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function placeBit() {
    let issue_id = numberToU64(1)
    let person = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
    let  bidder_github_name  = stringToSymbol("bidgitname1")
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")

    let values = [issue_id,person,bidder_github_name, github_name, repository_name]
    let result = await contractInt('place_bid', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function assignedToUser() {
    let issue_id = numberToU64(1)
    let  bidder_github_name  = stringToSymbol("bidgitname1")
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id,bidder_github_name, github_name, repository_name,poster]
    let result = await contractInt('assigned_bid_to_user', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}





async function CompleteBid() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let user = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,user]
    let result = await contractInt('completed_bits', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function ReleasePayment() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,poster]
    let result = await contractInt('release_payment', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function RejectWork() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,poster]
    let result = await contractInt('release_payment', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}
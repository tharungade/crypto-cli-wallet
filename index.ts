import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
  
async function main() {
    console.log("You have the following options: ");
    console.log("1. Generate a new key pair");
    console.log("2. get an air drop");
    console.log("3. send sol to a wallet");
    console.log("4. exit");
    rl.question("select the option:", (answer: string) => {
        if(answer === "1") {
            const keypair = Keypair.generate();
            console.log("Reciver: ", keypair.publicKey.toBase58());
            console.log("Private Key: ", keypair.secretKey);
            rl.close();
        }
        else if(answer === "2") {
            console.log("Enter public key of the wallet for the airdrop");
            rl.question("public key: ", (publicKey: string) => {
                console.log("Enter the amount of sol you want to send: ");
                rl.question("amount: ", async (amount: string) => {
                    console.log("Sending sol to ", publicKey, "amount: ", amount);
                    const connection = new Connection(clusterApiUrl("devnet"));
                    console.log(clusterApiUrl("devnet"));
                    const lamports = Number(amount) * LAMPORTS_PER_SOL;
                    try
                    {
                        const signature = await connection.requestAirdrop(new PublicKey(publicKey), lamports);
                        await connection.confirmTransaction(signature);
                        console.log(`Airdrop successful! Transaction signature: ${signature}`);
                        console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
                    }
                    catch(error)
                    {
                        console.log("Airdrop failed: ", error);
                    }
                    rl.close();
                });
            });
        }
        else if(answer === "3") {
            console.log("Enter private key of the sender");
            rl.question("Senders private key: ", (sendersPrivateKey: string) => {
                const connection = new Connection("https://api.devnet.solana.com");
                const payer = Keypair.fromSecretKey(Uint8Array.from(sendersPrivateKey.split(",").map(_ => Number(_))));
                console.log(payer.publicKey.toBase58());
                console.log("Enter public key of the receiver");
                rl.question("Receiver public key:", async (publicKey: string) => {
                    const receiverPublicKey = new PublicKey(publicKey);
                    // default to transfer 0.1 sol
                    const transaction = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: payer.publicKey,
                            toPubkey: receiverPublicKey,
                            lamports: LAMPORTS_PER_SOL * 0.1
                        })
                    );

                    transaction.feePayer = payer.publicKey;
                    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                    transaction.partialSign(payer);

                    const signature = await connection.sendRawTransaction(transaction.serialize());
                    console.log("Signature: ", signature);
                    rl.close();
                });
            });
        }
        else if(answer === "4") {
            console.log("exited");
            rl.close();
        }
        else {
            console.log("Invalid option");
            rl.close();
        }
        
    });
}

main()
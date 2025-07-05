"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("You have the following options: ");
        console.log("1. Generate a new key pair");
        console.log("2. get an air drop");
        console.log("3. send sol to a wallet");
        console.log("4. exit");
        rl.question("select the option:", (answer) => {
            if (answer === "1") {
                const keypair = web3_js_1.Keypair.generate();
                console.log("Reciver: ", keypair.publicKey.toBase58());
                console.log("Private Key: ", keypair.secretKey);
                rl.close();
            }
            else if (answer === "2") {
                console.log("Enter public key of the wallet for the airdrop");
                rl.question("public key: ", (publicKey) => {
                    console.log("Enter the amount of sol you want to send: ");
                    rl.question("amount: ", (amount) => __awaiter(this, void 0, void 0, function* () {
                        console.log("Sending sol to ", publicKey, "amount: ", amount);
                        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
                        console.log((0, web3_js_1.clusterApiUrl)("devnet"));
                        const lamports = Number(amount) * web3_js_1.LAMPORTS_PER_SOL;
                        try {
                            const signature = yield connection.requestAirdrop(new web3_js_1.PublicKey(publicKey), lamports);
                            yield connection.confirmTransaction(signature);
                            console.log(`Airdrop successful! Transaction signature: ${signature}`);
                            console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
                        }
                        catch (error) {
                            console.log("Airdrop failed: ", error);
                        }
                        rl.close();
                    }));
                });
            }
            else if (answer === "3") {
                console.log("await for the feature");
                rl.close();
            }
            else if (answer === "4") {
                console.log("exited");
                rl.close();
            }
            else {
                console.log("Invalid option");
                rl.close();
            }
        });
    });
}
main();

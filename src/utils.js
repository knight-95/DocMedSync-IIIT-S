import Web3 from "web3";

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
       
        const onLoad =  async () => {

            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                   
                    await window.ethereum.enable();
           
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
         
            else if (window.web3) {
             
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                resolve(web3);
            }
            
            else {
                reject("Please install metamask");
            }
        };
        onLoad();
    });
};

export { getWeb3 };
